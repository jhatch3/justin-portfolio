// Express server: serves the static portfolio + the /api/chat endpoint.
// Streams Anthropic responses via SSE, with prompt caching on the system
// prompt and a sliding-window per-IP rate limit.

import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './system-prompt.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..');

// Load .env from server/ first, then project root - regardless of CWD.
// dotenv won't overwrite already-set vars, so first wins.
dotenv.config({ path: path.join(here, '.env') });
dotenv.config({ path: path.join(projectRoot, '.env') });

const PORT = parseInt(process.env.PORT || '3000', 10);
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const RATE_WINDOW_MS = (parseFloat(process.env.RATE_LIMIT_WINDOW_HOURS || '24')) * 60 * 60 * 1000;
const RATE_MAX = parseInt(process.env.RATE_LIMIT_MAX_MESSAGES || '30', 10);
const MAX_INPUT_CHARS = parseInt(process.env.MAX_INPUT_CHARS || '2000', 10);
const MAX_OUTPUT_TOKENS = parseInt(process.env.MAX_OUTPUT_TOKENS || '600', 10);

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('[server] ANTHROPIC_API_KEY missing - copy .env.example to .env and fill it in.');
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  maxRetries: 0,
  timeout: 60_000,
});

// ─── Sliding-window rate limiter ─────────────────────────────────────────────
// Key: client IP. Value: array of timestamps within the window.
const hits = new Map();

function rateCheck(ip) {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const arr = (hits.get(ip) || []).filter(t => t > cutoff);
  if (arr.length >= RATE_MAX) {
    const oldest = arr[0];
    const retryMs = (oldest + RATE_WINDOW_MS) - now;
    return { ok: false, retryMs };
  }
  arr.push(now);
  hits.set(ip, arr);
  return { ok: true, remaining: RATE_MAX - arr.length };
}

// Periodic cleanup so the map doesn't grow unbounded.
setInterval(() => {
  const cutoff = Date.now() - RATE_WINDOW_MS;
  for (const [ip, arr] of hits) {
    const fresh = arr.filter(t => t > cutoff);
    if (fresh.length === 0) hits.delete(ip);
    else hits.set(ip, fresh);
  }
}, 60 * 60 * 1000).unref();

// ─── App ─────────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '32kb' }));

// Trust X-Forwarded-For for one proxy hop (lets RateCheck see real IP if you put nginx/cloudflare in front).
app.set('trust proxy', 1);

app.get('/api/health', (_req, res) => res.json({ ok: true, model: MODEL }));

// ─── Stock quote proxy (Yahoo Finance, server-side to dodge CORS) ───────────
const quoteCache = new Map(); // sym -> { ts, data }
const QUOTE_TTL_MS = 5_000;

function downsample(arr, n) {
  const cleaned = arr.filter(v => v != null);
  if (cleaned.length <= n) return cleaned;
  const out = [];
  for (let i = 0; i < n; i++) out.push(cleaned[Math.floor(i * cleaned.length / n)]);
  return out;
}

app.get('/api/quote/:symbol', async (req, res) => {
  const sym = (req.params.symbol || '').toUpperCase();
  if (!/^[A-Z][A-Z0-9.\-]{0,8}$/.test(sym)) return res.status(400).json({ error: 'bad_symbol' });

  const cached = quoteCache.get(sym);
  if (cached && Date.now() - cached.ts < QUOTE_TTL_MS) {
    return res.json(cached.data);
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=5m&range=1d`;
    const r = await fetch(url, {
      headers: {
        // Yahoo returns 401 without a real-looking UA.
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        'Accept': 'application/json',
      },
    });
    if (!r.ok) return res.status(502).json({ error: 'upstream', status: r.status });
    const j = await r.json();
    const result = j?.chart?.result?.[0];
    if (!result) return res.status(404).json({ error: 'not_found' });

    const meta = result.meta || {};
    const closes = result.indicators?.quote?.[0]?.close || [];
    const sparkline = downsample(closes, 40);

    const data = {
      symbol: sym,
      name: meta.longName || meta.shortName || sym,
      price: meta.regularMarketPrice,
      previousClose: meta.previousClose ?? meta.chartPreviousClose,
      currency: meta.currency || 'USD',
      marketState: meta.marketState, // REGULAR | CLOSED | PRE | POST
      sparkline,
      ts: Date.now(),
    };
    quoteCache.set(sym, { ts: Date.now(), data });
    res.json(data);
  } catch (err) {
    console.error(`[quote] ${sym} failed:`, err.message);
    res.status(502).json({ error: 'fetch_failed', message: err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const t0 = Date.now();
  const tag = `[chat ${t0.toString(36).slice(-5)}]`;
  console.log(`${tag} POST from ${ip}`);

  // Rate limit
  const rl = rateCheck(ip);
  if (!rl.ok) {
    console.log(`${tag} rate limited`);
    return res.status(429).json({
      error: 'rate_limited',
      message: `Too many messages. Try again in ${Math.ceil(rl.retryMs / 60000)} minutes.`,
    });
  }

  // Validate body
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!messages || !messages.length) {
    return res.status(400).json({ error: 'bad_request', message: 'messages[] required' });
  }
  // Sanitize: only allow user/assistant roles, stringify content, length cap
  const cleaned = [];
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
    const text = typeof m.content === 'string' ? m.content : '';
    if (!text.trim()) continue;
    cleaned.push({ role: m.role, content: text.slice(0, MAX_INPUT_CHARS) });
  }
  if (!cleaned.length || cleaned[cleaned.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'bad_request', message: 'last message must be from user' });
  }
  // Cap conversation length to keep cost predictable
  const trimmed = cleaned.slice(-12);

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // Disable Nagle so each SSE chunk is sent immediately instead of being
  // batched at the TCP layer (Node http defaults to Nagle on, which
  // stalls small SSE writes for ~40ms on localhost / over loopback).
  req.socket?.setNoDelay(true);

  const send = (obj) => {
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
  };

  // Real client-abort detection: only the response 'close' event fires
  // *and* the response wasn't intentionally ended. `req.on('close')` is
  // unreliable here - it fires when the request body is consumed (which
  // happens immediately for a small JSON POST), not on connection abort.
  let aborted = false;
  res.on('close', () => {
    if (!res.writableEnded) {
      aborted = true;
      console.log(`${tag} client aborted @ ${Date.now() - t0}ms`);
    } else {
      console.log(`${tag} response closed cleanly @ ${Date.now() - t0}ms`);
    }
  });
  res.on('error', (e) => console.log(`${tag} res error:`, e?.message));
  req.socket?.on('error', (e) => console.log(`${tag} socket error:`, e?.message));

  send({ type: 'ready' });
  console.log(`${tag} sent ready, calling Anthropic model=${MODEL}, msgs=${trimmed.length}`);

  let firstDeltaAt = null;
  let deltaCount = 0;
  let eventCount = 0;
  let streamRef = null;

  // Hook the abort-from-client into the upstream Anthropic call so we
  // don't keep generating after the user gave up.
  res.on('close', () => {
    if (aborted && streamRef) {
      try { streamRef.controller?.abort?.(); } catch {}
    }
  });

  let usage = {};
  try {
    streamRef = anthropic.messages.stream({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      // Prompt caching: mark the system block ephemeral so identical
      // system prompts hit the cache on subsequent calls within ~5 min.
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: trimmed,
    });

    for await (const event of streamRef) {
      if (aborted) break;
      eventCount++;
      // Log the first few raw events so we can verify the SDK is delivering.
      if (eventCount <= 3) console.log(`${tag} evt#${eventCount} type=${event.type} @ ${Date.now() - t0}ms`);
      if (event.type === 'message_start' && event.message?.usage) {
        usage = { ...usage, ...event.message.usage };
      }
      if (event.type === 'message_delta' && event.usage) {
        usage = { ...usage, ...event.usage };
      }
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        if (!firstDeltaAt) {
          firstDeltaAt = Date.now();
          console.log(`${tag} first delta @ ${firstDeltaAt - t0}ms`);
        }
        deltaCount++;
        send({ type: 'delta', text: event.delta.text });
      }
    }

    if (!aborted) {
      console.log(`${tag} done in ${Date.now() - t0}ms, events=${eventCount}, deltas=${deltaCount}, usage=`, usage);
      send({
        type: 'done',
        usage: {
          input: usage.input_tokens,
          output: usage.output_tokens,
          cache_read: usage.cache_read_input_tokens,
          cache_create: usage.cache_creation_input_tokens,
        },
        remaining: rl.remaining,
      });
      res.end();
    } else {
      console.log(`${tag} aborted after ${eventCount} events, ${deltaCount} deltas`);
    }
  } catch (err) {
    console.error(`${tag} ERROR after ${Date.now() - t0}ms:`, err?.status || '', err?.message || err);
    if (err?.error) console.error(`${tag} error body:`, JSON.stringify(err.error));
    if (!aborted && !res.writableEnded) {
      const msg = err?.error?.error?.message || err?.message || 'upstream_error';
      send({ type: 'error', message: msg });
      res.end();
    }
  }
});

// Root → traditional landing page (FAANG-friendly portfolio).
app.get('/', (_req, res) => res.sendFile(path.join(projectRoot, 'landing.html')));

// /desktop → the macOS-simulation portfolio (file has a space, can't rely on
// the default index lookup).
app.get('/desktop', (_req, res) => res.sendFile(path.join(projectRoot, 'Justin Hatch.html')));

// Static files (the portfolio prototype). Served LAST so /api routes win.
app.use(express.static(projectRoot, {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) res.setHeader('Content-Type', 'application/pdf');
  },
}));

// Find non-internal IPv4 addresses so the user can hit the server from
// other devices on the same Wi-Fi (phone, tablet).
function lanAddresses() {
  const out = [];
  const ifs = os.networkInterfaces();
  for (const name of Object.keys(ifs)) {
    for (const addr of ifs[name] || []) {
      if (addr.family === 'IPv4' && !addr.internal) out.push({ name, address: addr.address });
    }
  }
  return out;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] listening on 0.0.0.0:${PORT}`);
  console.log(`[server] local:   http://localhost:${PORT}/Justin%20Hatch.html`);
  const lans = lanAddresses();
  if (lans.length) {
    console.log(`[server] for iPhone / other devices on this Wi-Fi:`);
    for (const { name, address } of lans) {
      console.log(`[server]   http://${address}:${PORT}/Justin%20Hatch.html   (${name})`);
    }
  } else {
    console.log(`[server] (no LAN interfaces found - only localhost will work)`);
  }
  console.log(`[server] model=${MODEL}  rate=${RATE_MAX}/${process.env.RATE_LIMIT_WINDOW_HOURS || '24'}h`);
});
