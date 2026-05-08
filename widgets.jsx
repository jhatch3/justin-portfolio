// widgets.jsx - stock ticker + "Generating" token stream

const { useState: uS, useEffect: uE, useMemo: uM, useRef: uRf } = React;

// ─── Stock ticker (real data via /api/quote/:symbol → Yahoo) ─────────────────
const TICKER_SYMBOLS = ['SPY', 'QQQ', 'NVDA', 'AAPL', 'MSFT', 'GOOGL', 'TSLA'];

const StockWidget = ({ top = 56, right = 18, w = 440, h = 156 }) => {
  const [sym, setSym] = uS('SPY');
  const [data, setData] = uS(null);
  const [error, setError] = uS(null);
  const [loading, setLoading] = uS(true);
  const [bump, setBump] = uS(0); // manual reload trigger

  uE(() => {
    let cancelled = false;
    const fetchQuote = async () => {
      try {
        const r = await fetch(`/api/quote/${sym}`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        if (!cancelled) { setData(j); setError(null); setLoading(false); }
      } catch (e) {
        if (!cancelled) { setError(e.message); setLoading(false); }
      }
    };
    setLoading(true);
    fetchQuote();
    const id = setInterval(fetchQuote, 5000);
    return () => { cancelled = true; clearInterval(id); };
  }, [sym, bump]);

  const reload = () => setBump(b => b + 1);

  const series = data?.sparkline?.length ? data.sparkline : [];
  const price = data?.price ?? 0;
  const prev = data?.previousClose ?? price;
  const change = price - prev;
  const pct = prev ? (change / prev) * 100 : 0;
  const up = change >= 0;
  const accent = error ? 'rgba(255,255,255,0.45)' : (up ? '#30d158' : '#ff453a');
  const live = data?.marketState === 'REGULAR';

  const W = w - 32, H = 56;
  const mn = series.length ? Math.min(...series) : 0;
  const mx = series.length ? Math.max(...series) : 1;
  const rng = Math.max(0.001, mx - mn);
  const pts = series.map((v, i) => [(i / Math.max(1, series.length - 1)) * W, H - ((v - mn) / rng) * H]);
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return (
    <div style={{
      position: 'fixed', top, right, zIndex: 50,
      width: w, height: h, padding: 14,
      background: 'rgba(28,28,30,0.55)',
      backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      borderRadius: 22, border: '0.5px solid rgba(255,255,255,0.5)',
      boxShadow: '0 12px 36px rgba(0,0,0,0.22), inset 0 0.5px 0 rgba(255,255,255,0.6)',
      color: '#f5f5f7', overflow: 'hidden', boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <select value={sym} onChange={e => setSym(e.target.value)}
          style={{ background: 'transparent', color: '#f5f5f7', border: 0, outline: 0, padding: 0,
                   fontSize: 17, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', appearance: 'none' }}>
          {TICKER_SYMBOLS.map(s => <option key={s} value={s} style={{ color: '#1d1d1f' }}>{s}</option>)}
        </select>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data?.name || (loading ? 'loading…' : sym)}
        </span>
        <span title={live ? 'market open' : (data?.marketState || '')} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: live ? '#30d158' : '#8e8e93',
          boxShadow: live ? '0 0 8px #30d158' : 'none',
        }} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'ui-monospace, monospace', letterSpacing: '-0.02em', marginTop: 4 }}>
        {price ? `$${price.toFixed(2)}` : '-'}
      </div>
      <div style={{ display: 'flex', gap: 6, fontSize: 12, color: accent, fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
        {error ? (
          <button onClick={reload} style={{
            background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.18)',
            color: '#f5f5f7', borderRadius: 6, padding: '2px 10px', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
          }}>↻ Reload</button>
        ) : price ? (
          <span>{up ? '▲' : '▼'} {up ? '+' : ''}{change.toFixed(2)} ({up ? '+' : ''}{pct.toFixed(2)}%)</span>
        ) : (
          <span>-</span>
        )}
        <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>1D</span>
      </div>
      {series.length > 1 ? (
        <svg width={W} height={H} style={{ marginTop: 6 }}>
          <defs><linearGradient id={`spk-${sym}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient></defs>
          <path d={`${path} L${W},${H} L0,${H} Z`} fill={`url(#spk-${sym})`} />
          <path d={path} fill="none" stroke={accent} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      ) : (
        <div style={{
          marginTop: 6, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <button onClick={reload} disabled={loading} style={{
            background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.18)',
            color: '#f5f5f7', borderRadius: 8, padding: '6px 14px',
            cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
            fontSize: 12, fontWeight: 600, opacity: loading ? 0.5 : 1,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ display: 'inline-block', transition: 'transform 0.4s', transform: loading ? 'rotate(360deg)' : 'none' }}>↻</span>
            {loading ? 'Loading…' : 'Reload chart'}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Live order book (Coinbase WebSocket level2) ─────────────────────────────
const COINBASE_PAIRS = [
  { id: 'BTC-USD', name: 'Bitcoin' },
  { id: 'ETH-USD', name: 'Ethereum' },
  { id: 'SOL-USD', name: 'Solana' },
];
const BOOK_DEPTH = 8;

const OrderBookWidget = ({ top = 442, right = 18, w = 300, h = 340 }) => {
  const [pair, setPair] = uS('BTC-USD');
  const [, setTick] = uS(0);
  const [status, setStatus] = uS('connecting'); // connecting | live | error | closed
  const bidsRef = uRf(new Map());
  const asksRef = uRf(new Map());
  const lastRenderRef = uRf(0);
  const wsRef = uRf(null);

  uE(() => {
    bidsRef.current = new Map();
    asksRef.current = new Map();
    setStatus('connecting');
    setTick(t => t + 1);

    const ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'subscribe',
        product_ids: [pair],
        channels: ['level2_batch'],
      }));
    };

    ws.onmessage = (e) => {
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }

      if (msg.type === 'snapshot') {
        bidsRef.current = new Map(msg.bids.map(([p, s]) => [p, parseFloat(s)]));
        asksRef.current = new Map(msg.asks.map(([p, s]) => [p, parseFloat(s)]));
        setStatus('live');
        setTick(t => t + 1);
      } else if (msg.type === 'l2update') {
        for (const [side, price, size] of (msg.changes || [])) {
          const map = side === 'buy' ? bidsRef.current : asksRef.current;
          const sz = parseFloat(size);
          if (sz === 0) map.delete(price);
          else map.set(price, sz);
        }
        // throttle re-renders to ~10fps
        const now = performance.now();
        if (now - lastRenderRef.current > 100) {
          lastRenderRef.current = now;
          setTick(t => t + 1);
        }
      } else if (msg.type === 'error') {
        setStatus('error');
      }
    };

    ws.onerror = () => setStatus('error');
    ws.onclose = () => setStatus(s => s === 'error' ? s : 'closed');

    return () => { try { ws.close(); } catch {} };
  }, [pair]);

  // Top N levels each side
  const topAsks = [...asksRef.current.entries()]
    .map(([p, s]) => [parseFloat(p), s])
    .filter(([, s]) => s > 0)
    .sort((a, b) => a[0] - b[0])
    .slice(0, BOOK_DEPTH);
  const topBids = [...bidsRef.current.entries()]
    .map(([p, s]) => [parseFloat(p), s])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[0] - a[0])
    .slice(0, BOOK_DEPTH);

  const maxSize = Math.max(
    1,
    ...topAsks.map(([, s]) => s),
    ...topBids.map(([, s]) => s),
  );

  const bestAsk = topAsks[0]?.[0];
  const bestBid = topBids[0]?.[0];
  const spread = bestAsk && bestBid ? bestAsk - bestBid : 0;
  const mid = bestAsk && bestBid ? (bestAsk + bestBid) / 2 : 0;
  const fmt = (n, d = 2) => Number(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

  const dotColor =
    status === 'live'       ? '#30d158' :
    status === 'connecting' ? '#ffd60a' :
                              '#ff453a';

  const Row = ({ price, size, side }) => {
    const fill = (size / maxSize) * 100;
    const c = side === 'ask' ? '#ff453a' : '#30d158';
    return (
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 11, lineHeight: 1.3,
        padding: '1px 6px',
      }}>
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 0,
          width: `${fill}%`, background: side === 'ask' ? 'rgba(255,69,58,0.16)' : 'rgba(48,209,88,0.16)',
          borderRadius: 2,
        }} />
        <span style={{ color: c, position: 'relative', zIndex: 1, fontWeight: 600 }}>{fmt(price)}</span>
        <span style={{ color: 'rgba(255,255,255,0.65)', position: 'relative', zIndex: 1 }}>{size.toFixed(4)}</span>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', top, right, zIndex: 50,
      width: w, height: h, padding: 12,
      background: 'rgba(28,28,30,0.55)',
      backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.5)',
      boxShadow: '0 12px 36px rgba(0,0,0,0.22), inset 0 0.5px 0 rgba(255,255,255,0.6)',
      color: '#f5f5f7', overflow: 'hidden', boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginBottom: 4 }}>
        <select value={pair} onChange={(e) => setPair(e.target.value)} style={{
          background: 'transparent', color: '#f5f5f7', border: 0, outline: 0, padding: 0,
          fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', appearance: 'none',
        }}>
          {COINBASE_PAIRS.map(p => <option key={p.id} value={p.id} style={{ color: '#1d1d1f' }}>{p.id}</option>)}
        </select>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          live order book · coinbase
        </span>
        <span title={status} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: dotColor, boxShadow: status === 'live' ? `0 0 6px ${dotColor}` : 'none',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 6px 4px' }}>
        <span>price</span><span>size</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Asks (descending so closer to mid is at the bottom of the asks block) */}
        <div style={{ display: 'flex', flexDirection: 'column-reverse', flex: 1, justifyContent: 'flex-start', minHeight: 0, overflow: 'hidden' }}>
          {topAsks.map(([p, s]) => <Row key={`a-${p}`} price={p} size={s} side="ask" />)}
        </div>
        {/* Spread */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 6px', margin: '3px 0',
          borderTop: '0.5px solid rgba(255,255,255,0.1)',
          borderBottom: '0.5px solid rgba(255,255,255,0.1)',
          fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 11,
        }}>
          <span style={{ fontWeight: 700, color: '#f5f5f7' }}>{mid ? fmt(mid) : '-'}</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
            {spread ? `spread ${fmt(spread)}` : 'awaiting feed'}
          </span>
        </div>
        {/* Bids */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {topBids.map(([p, s]) => <Row key={`b-${p}`} price={p} size={s} side="bid" />)}
        </div>
      </div>
    </div>
  );
};

// ─── Generating / Token stream ───────────────────────────────────────────────
const SAMPLES = [
  ['Hire', ' Justin', '.', '\n\n', 'He', ' ships', ' AI', ' systems', ' that', ' actually', ' work', '.'],
  ['Currently', ' building', ' a', ' sales', ' agent', ' at', ' Modern', ' Amenities', '.', '\n', 'Available', ' June', ' 2026', '.'],
  ['Looking', ' for', ':', ' applied', ' AI', ',', ' agents', ',', ' or', ' anything', ' weird', ' and', ' new', '.'],
  ['Reach', ' out', ':', ' justin', '@', 'hatch', '.', 'dev'],
];

const TokenStreamWidget = ({ top = 230, right = 18 }) => {
  const [si, setSi] = uS(0);
  const [ti, setTi] = uS(0);

  uE(() => {
    const sample = SAMPLES[si];
    if (ti < sample.length) {
      const id = setTimeout(() => setTi(ti + 1), 90 + Math.random() * 110);
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => { setSi((si + 1) % SAMPLES.length); setTi(0); }, 2400);
      return () => clearTimeout(id);
    }
  }, [ti, si]);

  const tokens = SAMPLES[si].slice(0, ti);

  return (
    <div style={{
      position: 'fixed', top, right, zIndex: 50,
      width: 300, height: 220, padding: 16,
      background: 'rgba(28,28,30,0.55)',
      backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.5)',
      boxShadow: '0 12px 36px rgba(0,0,0,0.22), inset 0 0.5px 0 rgba(255,255,255,0.6)',
      color: '#f5f5f7', overflow: 'hidden', boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginBottom: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158', boxShadow: '0 0 8px #30d158' }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
          Generating
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 10, fontFamily: 'ui-monospace, "SF Mono", monospace', color: 'rgba(255,255,255,0.4)' }}>
          claude · 124 tok/s
        </span>
      </div>
      <div style={{
        flex: 1, minHeight: 0, overflow: 'hidden',
        fontFamily: 'ui-monospace, "SF Mono", monospace',
        fontSize: 13, lineHeight: 1.65, color: '#e8e6e3',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {tokens.map((tok, i) => (
          <span key={i} style={{
            background: i === tokens.length - 1 ? 'rgba(255,159,10,0.4)' : 'rgba(255,159,10,0.13)',
            borderRadius: 3, padding: '0 2px',
            transition: 'background 0.35s ease',
          }}>{tok}</span>
        ))}
        <span style={{
          display: 'inline-block', width: 7, height: 14, background: '#ff9f0a',
          verticalAlign: 'text-bottom', marginLeft: 1, animation: 'tsCur 1s steps(2) infinite',
        }} />
      </div>
      <style>{`@keyframes tsCur{50%{opacity:0}}`}</style>
    </div>
  );
};

// ─── Shared widget shell ─────────────────────────────────────────────────────
const widgetShell = {
  background: 'rgba(28,28,30,0.55)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  borderRadius: 20,
  border: '0.5px solid rgba(255,255,255,0.5)',
  boxShadow: '0 12px 36px rgba(0,0,0,0.22), inset 0 0.5px 0 rgba(255,255,255,0.6)',
  color: '#f5f5f7',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

// ─── GitHub widget ───────────────────────────────────────────────────────────
const GitHubMark = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.8.55C20.71 21.39 24 17.07 24 12 24 5.65 18.85.5 12.5.5H12z"/>
  </svg>
);

const GitHubWidget = ({ top = 470, right = 18 }) => {
  const link = (window.JH_DATA && window.JH_DATA.links && window.JH_DATA.links.github) || { href: '#', label: 'github.com/jhatch3' };
  const handle = link.label.replace(/^github\.com\//, '');
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" style={{
      ...widgetShell, position: 'fixed', top, right, zIndex: 50,
      width: 300, height: 88, padding: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: '100%' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: 'linear-gradient(160deg, #2a2a2e, #0d0d10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#f5f5f7', flexShrink: 0,
          boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18)',
        }}>
          <GitHubMark size={24} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>GitHub</div>
          <div style={{ fontSize: 15, fontWeight: 600, fontFamily: 'ui-monospace, "SF Mono", monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
            @{handle}
          </div>
        </div>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>↗</span>
      </div>
    </a>
  );
};

// ─── LinkedIn widget ─────────────────────────────────────────────────────────
const LinkedInMark = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
  </svg>
);

const LinkedInWidget = ({ top = 576, right = 18 }) => {
  const link = (window.JH_DATA && window.JH_DATA.links && window.JH_DATA.links.linkedin) || { href: '#', label: 'linkedin.com/in/justinhatch' };
  const D = window.JH_DATA || {};
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" style={{
      ...widgetShell, position: 'fixed', top, right, zIndex: 50,
      width: 300, height: 88, padding: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: '100%' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: 'linear-gradient(160deg, #2c8ed6, #0a66c2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', flexShrink: 0,
          boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.25)',
        }}>
          <LinkedInMark size={24} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>LinkedIn</div>
          <div style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
            {D.name || 'Justin Hatch'}
          </div>
        </div>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>↗</span>
      </div>
    </a>
  );
};

// Chat moved into apps.jsx as ChatApp (now a real macOS app in the dock).

Object.assign(window, { StockWidget, TokenStreamWidget, GitHubWidget, LinkedInWidget, OrderBookWidget });
