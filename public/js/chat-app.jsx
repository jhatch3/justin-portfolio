// chat-app.jsx - the one chatbot, shared by both entry points.
//
// desktop.html mounts it as a macOS window app; landing.html mounts it inside a
// floating, resizable panel. Same component, same /api/chat SSE stream, so a
// fix to the bot is a fix in both places.
//
// The two pages don't look alike, so the only thing that varies is the palette:
// `theme="dark"` (default) is the macOS window look, `theme="light"` matches the
// landing page - white surface, page font, --accent bubbles. The light values are
// written as var(--token, #fallback) so the panel tracks landing.html's tokens
// while still rendering correctly anywhere those tokens don't exist.
//
// Wrapped in an IIFE and published on `window` on purpose: every .jsx here is
// compiled as a classic script sharing one global lexical scope, and both
// apps.jsx and landing.html already declare a top-level `const D`. A bare
// top-level declaration in this file would collide with one of them.
(() => {
  const PALETTES = {
    dark: {
      font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      shellBg: 'rgba(20,20,22,0.96)',
      shellText: '#f5f5f7',
      bannerBg: '#0c1018',
      bannerBorder: '0.5px solid rgba(184,212,240,0.18)',
      avatarBg: 'linear-gradient(160deg, #d4e3f5, #8eb4d8)',
      avatarText: '#1a1f2e',
      titleText: '#f5f5f7',
      subText: 'rgba(245,245,247,0.85)',
      dot: '#30d158',
      dotGlow: '0 0 6px #30d158',
      msgsBg: 'linear-gradient(180deg, rgba(28,28,30,0.5), rgba(20,20,22,0.5))',
      mineBg: '#b8d4f0',
      mineText: '#0a1020',
      mineBorder: 'none',
      theirsBg: 'rgba(40,44,54,0.95)',
      theirsText: '#f5f5f7',
      theirsBorder: 'none',
      bubbleShadow: '0 1px 1px rgba(0,0,0,0.18)',
      errText: '#ff8a85',
      errBg: 'rgba(255,69,58,0.12)',
      errBorder: '0.5px solid rgba(255,69,58,0.3)',
      barBg: 'rgba(28,28,30,0.7)',
      barBorder: '0.5px solid rgba(255,255,255,0.06)',
      inputBg: 'rgba(255,255,255,0.06)',
      inputText: '#f5f5f7',
      inputBorder: '0',
      placeholder: 'rgba(245,245,247,0.45)',
      sendOnBg: '#b8d4f0',
      sendOnText: '#0a1020',
      sendOffBg: 'rgba(255,255,255,0.1)',
      sendOffText: 'rgba(255,255,255,0.4)',
      codeBg: 'rgba(255,255,255,0.12)',
      link: '#7ec0ff',
      chipBg: 'rgba(255,255,255,0.10)',
      chipText: '#f5f5f7',
      chipBorder: '1px solid rgba(255,255,255,0.18)',
      cardBg: 'rgba(28,28,30,0.96)',
      cardBorder: '1px solid rgba(255,255,255,0.14)',
      fieldBg: 'rgba(255,255,255,0.06)',
      fieldBorder: '1px solid rgba(255,255,255,0.14)',
      fieldBad: '1px solid #ff8a85',
    },
    light: {
      font: 'inherit',
      shellBg: 'var(--surface, #ffffff)',
      shellText: 'var(--ink-2, #2a4365)',
      bannerBg: 'var(--surface, #ffffff)',
      bannerBorder: '1px solid var(--border, rgba(10,37,64,0.10))',
      avatarBg: 'var(--accent, #1d4ed8)',
      avatarText: '#ffffff',
      titleText: 'var(--ink, #0a2540)',
      subText: 'var(--ink-3, #5a7090)',
      dot: '#16a34a',
      dotGlow: 'none',
      msgsBg: 'var(--surface, #ffffff)',
      mineBg: 'var(--accent, #1d4ed8)',
      mineText: '#ffffff',
      mineBorder: '2px solid #163fae',
      // On a white panel a near-white bubble disappears. Darker fill + a 2px
      // edge, so each turn reads as its own block. (1.5px got rounded down to a
      // hairline by Chrome, which defeated the point.)
      theirsBg: '#eaeff6',
      theirsText: 'var(--ink, #0a2540)',
      theirsBorder: '2px solid rgba(10,37,64,0.22)',
      bubbleShadow: 'none',
      errText: '#b42318',
      errBg: 'rgba(180,35,24,0.07)',
      errBorder: '1px solid rgba(180,35,24,0.22)',
      barBg: 'var(--surface, #ffffff)',
      barBorder: '1px solid var(--border, rgba(10,37,64,0.10))',
      inputBg: 'var(--bg, #fafaf7)',
      inputText: 'var(--ink, #0a2540)',
      inputBorder: '1px solid var(--border, rgba(10,37,64,0.10))',
      placeholder: 'var(--ink-3, #5a7090)',
      sendOnBg: 'var(--accent, #1d4ed8)',
      sendOnText: '#ffffff',
      sendOffBg: 'rgba(10,37,64,0.06)',
      sendOffText: 'rgba(10,37,64,0.35)',
      codeBg: 'rgba(10,37,64,0.08)',
      link: 'var(--accent, #1d4ed8)',
      chipBg: 'var(--surface, #ffffff)',
      chipText: 'var(--ink-2, #2a4365)',
      chipBorder: '1px solid rgba(10,37,64,0.22)',
      cardBg: 'var(--surface, #ffffff)',
      cardBorder: '2px solid rgba(10,37,64,0.22)',
      fieldBg: 'var(--bg, #fafaf7)',
      fieldBorder: '1px solid rgba(10,37,64,0.20)',
      fieldBad: '1px solid #b42318',
    },
  };

  // ─── Markdown ──────────────────────────────────────────────────────────────
  // The bot is told to keep formatting light (rule 7a in server/system-prompt.mjs),
  // but a model will still reach for **bold** or a dash list, and raw asterisks
  // in a chat bubble read as a bug. So render the small subset it actually uses.
  // Everything is built from React elements - never innerHTML - so model output
  // cannot inject markup, and link hrefs are restricted to http(s)/mailto so a
  // "[click](javascript:…)" stays inert text.
  const INLINE_MD = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|\[[^\]\n]+\]\([^)\s]+\)|https?:\/\/[^\s<>()]+|[\w.+-]+@[\w-]+\.[\w.-]{2,})/g;

  // A link is safe if it is http(s)/mailto, or has no scheme at all - the bot
  // routinely writes same-origin paths like [Resume.pdf](Resume.pdf), and those
  // used to fall through to plain text. Protocol-relative "//host" counts as
  // off-site, so it needs an explicit scheme to pass.
  const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
  const safeHref = (u) => (SCHEME.test(u) ? /^(https?|mailto):/i.test(u) : !u.startsWith('//'));
  const MONO = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.92em' };

  const renderInline = (text, c, key) => {
    const out = [];
    const re = new RegExp(INLINE_MD.source, 'g');
    let last = 0, m, n = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) out.push(text.slice(last, m.index));
      const t = m[0];
      const k = `${key}i${n++}`;
      const link = /^\[([^\]\n]+)\]\(([^)\s]+)\)$/.exec(t);
      if (t.startsWith('**') || t.startsWith('__')) {
        out.push(<strong key={k} style={{ fontWeight: 600 }}>{t.slice(2, -2)}</strong>);
      } else if (t.startsWith('`')) {
        out.push(<code key={k} style={{ ...MONO, background: c.codeBg, padding: '1px 4px', borderRadius: 4 }}>{t.slice(1, -1)}</code>);
      } else if (link) {
        out.push(safeHref(link[2])
          ? <a key={k} href={link[2]} target="_blank" rel="noopener noreferrer" style={{ color: c.link }}>{link[1]}</a>
          : link[1]);
      } else if (/^https?:/.test(t)) {
        out.push(<a key={k} href={t} target="_blank" rel="noopener noreferrer" style={{ color: c.link, wordBreak: 'break-all' }}>{t}</a>);
      } else if (t.includes('@') && !t.startsWith('*') && !t.startsWith('_')) {
        out.push(<a key={k} href={`mailto:${t}`} style={{ color: c.link, wordBreak: 'break-all' }}>{t}</a>);
      } else {
        out.push(<em key={k}>{t.slice(1, -1)}</em>);
      }
      last = m.index + t.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  };

  const renderMarkdown = (text, c) => {
    const blocks = [];
    let para = [], list = null, fence = null;
    const flushPara = () => { if (para.length) { blocks.push({ kind: 'p', lines: para }); para = []; } };
    const flushList = () => { if (list) { blocks.push(list); list = null; } };

    for (const line of String(text).split('\n')) {
      if (/^\s*```/.test(line)) {                       // fenced code: keep verbatim
        if (fence) { blocks.push(fence); fence = null; }
        else { flushPara(); flushList(); fence = { kind: 'pre', lines: [] }; }
        continue;
      }
      if (fence) { fence.lines.push(line); continue; }

      const heading = /^\s*#{1,6}\s+(.*)$/.exec(line);
      const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
      const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);

      if (!line.trim()) { flushPara(); flushList(); continue; }
      if (heading) { flushPara(); flushList(); blocks.push({ kind: 'h', text: heading[1] }); continue; }
      if (bullet || numbered) {
        flushPara();
        const kind = bullet ? 'ul' : 'ol';
        if (!list || list.kind !== kind) { flushList(); list = { kind, items: [] }; }
        list.items.push((bullet || numbered)[1]);
        continue;
      }
      flushList();
      para.push(line);
    }
    if (fence) blocks.push(fence);                      // unterminated fence, mid-stream
    flushPara();
    flushList();

    const gap = (i) => (i === 0 ? 0 : 6);
    return blocks.map((b, i) => {
      const k = `b${i}`;
      if (b.kind === 'p') {
        return <p key={k} style={{ margin: `${gap(i)}px 0 0`, whiteSpace: 'pre-wrap' }}>{renderInline(b.lines.join('\n'), c, k)}</p>;
      }
      if (b.kind === 'h') {
        return <div key={k} style={{ margin: `${gap(i)}px 0 0`, fontWeight: 600 }}>{renderInline(b.text, c, k)}</div>;
      }
      if (b.kind === 'pre') {
        return <pre key={k} style={{ ...MONO, margin: `${gap(i)}px 0 0`, padding: 8, background: c.codeBg, borderRadius: 8, overflowX: 'auto', whiteSpace: 'pre' }}>{b.lines.join('\n')}</pre>;
      }
      const List = b.kind === 'ul' ? 'ul' : 'ol';
      return (
        // Marker style set inline: a host page's list reset would otherwise
        // leave the items looking like stray indented lines.
        <List key={k} style={{
          margin: `${gap(i)}px 0 0`, paddingLeft: 20,
          listStyleType: b.kind === 'ul' ? 'disc' : 'decimal',
          listStylePosition: 'outside',
        }}>
          {b.items.map((it, j) => <li key={`${k}l${j}`} style={{ margin: '2px 0' }}>{renderInline(it, c, `${k}l${j}`)}</li>)}
        </List>
      );
    });
  };

  // ─── Slash commands ────────────────────────────────────────────────────────
  // /help is answered here rather than by the model: it describes the UI, so it
  // should be instant, free, and identical every time. The rest expand into an
  // ordinary question, so the bot answers them in its own voice - the visitor
  // sees what they typed, the model sees the question.
  const HELP_TEXT = [
    "Here's what I can help with - type a command or just ask:",
    '',
    '- **/projects** - what he has built, and which repo to open first',
    '- **/experience** - roles, companies, what he actually shipped',
    '- **/skills** - languages, frameworks, the AI/ML stack',
    '- **/now** - what he is working on this month',
    '- **/hire** - why he might fit your role, and how to reach him',
    '- **/resume** - the PDF',
    '- **/contact** - leave him a message right here',
    '- **/examples** - questions I can answer well',
    '',
    'Plain questions work best - ask in your own words.',
  ].join('\n');

  // Every one of these is answerable straight from the ground-truth block, which
  // is the whole point: a suggestion the bot has to hedge on ("which project is
  // he proudest of?" - it has no record of his opinion) makes it look worse than
  // it is. Rendered as chips, so a visitor can pick one instead of typing.
  const EXAMPLES = [
    'What is he building at Horizon Intelligence Labs?',
    'Which project best shows his ML work?',
    'Has he shipped agents or RAG in production?',
    'What did he do at Modern Amenities?',
    'Is he open to new roles?',
    'What is in his AI/ML stack?',
  ];
  const EXAMPLES_TEXT = 'Any of these I can answer from what I know about him:';

  // The expansions ask for brevity: a shortcut should land a skimmable answer,
  // not the longest one the question could support.
  const COMMANDS = {
    '/projects': 'What has Justin built? Which project should I look at first? Keep it brief.',
    '/experience': "Walk me through Justin's work experience, briefly.",
    '/skills': "What are Justin's main skills, and what does he use them for? A short list is fine.",
    '/now': 'What is Justin working on right now? One or two sentences.',
    '/hire': "I'm hiring. Why might Justin fit the role, and how do I reach him? Keep it short.",
    '/resume': "Where can I find Justin's resume?",
  };
  const HELP_ALIASES = ['/help', '/commands', '/?', 'help'];
  const EXAMPLE_ALIASES = ['/examples', '/example', '/ask'];
  const CONTACT_ALIASES = ['/contact', '/message', '/msg', '/email'];

  const CONTACT_FALLBACK = (window.JH_DATA?.links?.email?.href) || 'mailto:jjhatch03@gmail.com';
  const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ─── Contact composer ──────────────────────────────────────────────────────
  // Three fields, in the thread, no page change and no mail client. Posts to
  // /api/contact, which stores the message before it tries to email it.
  const ContactForm = ({ c, theme, form, setForm, onSubmit, onCancel, nameRef }) => {
    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value, bad: f.bad.filter(b => b !== k) }));
    const busy = form.status === 'sending';
    const field = (k, extra = {}) => ({
      value: form[k],
      onChange: set(k),
      disabled: busy,
      className: `jh-chat-ta-${theme}`,
      'aria-invalid': form.bad.includes(k) || undefined,
      style: {
        width: '100%', font: 'inherit', fontSize: 13, lineHeight: 1.4,
        padding: '8px 10px', borderRadius: 8, outline: 0,
        background: c.fieldBg, color: c.inputText,
        border: form.bad.includes(k) ? c.fieldBad : c.fieldBorder,
        ...extra,
      },
    });

    return (
      <div style={{
        alignSelf: 'stretch', marginTop: 6, padding: 12, borderRadius: 14,
        background: c.cardBg, border: c.cardBorder, color: c.shellText,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: c.titleText }}>
          {form.intent === 'hire' ? 'Tell Justin about the role' : 'Message Justin'}
        </div>

        {/* Honeypot: off-screen and out of the tab order, so only a bot fills it. */}
        <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company}
          onChange={set('company')} name="company"
          style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }} />

        <input ref={nameRef} {...field('name')} placeholder="Your name" autoComplete="name" />
        <input {...field('email')} placeholder="Email he can reply to" type="email" autoComplete="email" inputMode="email" />
        <input {...field('subject')} placeholder="Subject (optional)" autoComplete="off" maxLength={120} />
        <textarea {...field('message', { resize: 'vertical', minHeight: 76 })} rows={3}
          placeholder={form.intent === 'hire'
            ? 'Role, team, and what you need - a couple of lines is plenty.'
            : 'What would you like to say?'} />

        {form.error && (
          <div style={{
            fontSize: 11.5, color: c.errText, background: c.errBg,
            border: c.errBorder, borderRadius: 8, padding: '6px 9px',
          }}>{form.error}</div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={onSubmit} disabled={busy} style={{
            font: 'inherit', fontSize: 13, fontWeight: 600, padding: '8px 16px',
            borderRadius: 999, border: 0, cursor: busy ? 'default' : 'pointer',
            background: busy ? c.sendOffBg : c.sendOnBg,
            color: busy ? c.sendOffText : c.sendOnText,
          }}>{busy ? 'Sending…' : 'Send to Justin'}</button>
          <button onClick={onCancel} disabled={busy} style={{
            font: 'inherit', fontSize: 12.5, padding: '8px 10px', borderRadius: 999,
            border: 0, background: 'transparent', color: c.subText,
            cursor: busy ? 'default' : 'pointer',
          }}>Cancel</button>
          <a href={CONTACT_FALLBACK} style={{ marginLeft: 'auto', fontSize: 11.5, color: c.link }}>
            or email directly
          </a>
        </div>
      </div>
    );
  };

  // contactRequest is a counter, not a boolean: the page bumps it every time a
  // visitor clicks "Hire me" or the contact icon, so a second click reopens the
  // composer even if they closed it.
  const ChatApp = ({ theme = 'dark', contactRequest = 0, contactIntent }) => {
    const c = PALETTES[theme] || PALETTES.dark;
    const [messages, setMessages] = React.useState([
      { role: 'assistant', local: true, content: "Hey - I'm Justin's bot. Ask me anything about his work, projects, or what he's after next.\n\nNew here? Type **/help** for the shortcut list." },
    ]);
    const [input, setInput] = React.useState('');
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [form, setForm] = React.useState(null);   // null = composer closed
    const scrollRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const nameRef = React.useRef(null);

    React.useEffect(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, sending, form?.open]);

    React.useEffect(() => { inputRef.current?.focus(); }, []);

    const openComposer = (intent) => {
      setForm(f => ({
        open: true, intent,
        name: f?.name || '', email: f?.email || '', message: f?.message || '',
        // One less thing to type for the case that matters most.
        subject: f?.subject || (intent === 'hire' ? 'Hiring inquiry' : ''),
        company: '', status: 'idle', error: null, bad: [],
      }));
      setTimeout(() => nameRef.current?.focus(), 0);
    };

    // The page asks for the composer by bumping contactRequest (0 = never asked).
    React.useEffect(() => {
      if (contactRequest > 0) openComposer(contactIntent);
    }, [contactRequest, contactIntent]);

    const submitContact = async () => {
      if (!form || form.status === 'sending') return;
      const payload = {
        name: form.name.trim(), email: form.email.trim(),
        subject: form.subject.trim(), message: form.message.trim(),
        company: form.company,
      };
      const bad = [];
      if (payload.name.length < 2) bad.push('name');
      if (!EMAIL_OK.test(payload.email)) bad.push('email');
      if (payload.message.length < 4) bad.push('message');
      if (bad.length) {
        setForm(f => ({ ...f, bad, error: 'A name, an email he can reply to, and a line or two.' }));
        return;
      }
      setForm(f => ({ ...f, status: 'sending', error: null, bad: [] }));
      try {
        const r = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(20000),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.ok) {
          setForm(f => ({ ...f, bad: Array.isArray(j.fields) ? j.fields : [] }));
          throw new Error(j.message || `HTTP ${r.status}`);
        }
        setForm(null);
        setMessages(prev => [...prev, {
          role: 'assistant', local: true,
          content: `Sent - Justin has it, and he'll reply to **${payload.email}**.\n\nAnything else you want to know while you're here?`,
        }]);
      } catch (e) {
        const why = /Failed to fetch|timed out|aborted/i.test(e?.message || '')
          ? "Couldn't reach the server."
          : (e?.message || 'Something went wrong.');
        setForm(f => ({ ...f, status: 'idle', error: why }));
      }
    };

    const send = async (override) => {
      const text = String(override ?? input).trim();
      if (!text || sending) return;
      if (override == null) setInput('');
      setError(null);

      const cmd = text.toLowerCase().split(/\s+/)[0];

      // UI commands answer locally - instant, free, and identical every time.
      // Both turns are marked local, so neither ends up in what the model sees.
      const localReply = (content, card) => {
        setMessages(prev => [...prev,
          { role: 'user', local: true, content: text },
          { role: 'assistant', local: true, content, card },
        ]);
      };
      if (HELP_ALIASES.includes(cmd)) { localReply(HELP_TEXT); return; }
      if (EXAMPLE_ALIASES.includes(cmd)) { localReply(EXAMPLES_TEXT, 'examples'); return; }
      if (CONTACT_ALIASES.includes(cmd)) {
        localReply("Sure - fill this in and I'll pass it straight to him.");
        openComposer('chat');
        return;
      }

      const next = [...messages,
        { role: 'user', content: text, send: COMMANDS[cmd] || text },
        { role: 'assistant', content: '' }];
      setMessages(next);
      setSending(true);

      const ctl = new AbortController();
      let timeoutReason = null;
      const connectTimer = setTimeout(() => { timeoutReason = 'connect_timeout'; ctl.abort(); }, 15000);
      let stallTimer = null;
      const resetStall = () => {
        if (stallTimer) clearTimeout(stallTimer);
        stallTimer = setTimeout(() => { timeoutReason = 'stall_timeout'; ctl.abort(); }, 30000);
      };
      resetStall();

      try {
        const payload = next
          .filter(m => !m.local && !(m.role === 'assistant' && m.content === ''))
          .map(m => ({ role: m.role, content: m.send || m.content }));
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payload }),
          signal: ctl.signal,
        });
        clearTimeout(connectTimer);
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.message || `HTTP ${res.status} from /api/chat`);
        }
        if (!res.body) throw new Error('no response body');
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          resetStall();
          buf += dec.decode(value, { stream: true });
          let idx;
          while ((idx = buf.indexOf('\n\n')) !== -1) {
            const raw = buf.slice(0, idx).trim();
            buf = buf.slice(idx + 2);
            if (!raw.startsWith('data:')) continue;
            let evt;
            try { evt = JSON.parse(raw.slice(5).trim()); } catch { continue; }
            if (evt.type === 'delta') {
              setMessages(prev => {
                const copy = prev.slice();
                copy[copy.length - 1] = { role: 'assistant', content: copy[copy.length - 1].content + evt.text };
                return copy;
              });
            } else if (evt.type === 'error') {
              throw new Error(evt.message || 'stream error');
            }
          }
        }
      } catch (e) {
        const reason = e?.message || String(e);
        const friendly =
          timeoutReason === 'connect_timeout' ? "Couldn't reach the server in 15s." :
          timeoutReason === 'stall_timeout'   ? "The server stopped sending data." :
          reason.includes('Failed to fetch') ? "Can't reach /api/chat. Are you on http://localhost:3000?" :
          reason.includes('HTTP 404')        ? "/api/chat returned 404 - wrong server port?" :
          reason.includes('HTTP 429')        ? "Rate limited - try again later." :
          reason;
        setError(friendly);
        setMessages(prev => {
          const copy = prev.slice();
          if (copy.length && copy[copy.length - 1].role === 'assistant' && !copy[copy.length - 1].content) copy.pop();
          return copy;
        });
      } finally {
        clearTimeout(connectTimer);
        if (stallTimer) clearTimeout(stallTimer);
        setSending(false);
      }
    };

    const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: c.shellBg, color: c.shellText, fontFamily: c.font,
      }}>
        <style>{`
          @keyframes chatDots { 0% { opacity: 0.3 } 30% { opacity: 1 } 60%, 100% { opacity: 0.3 } }
          .jh-chat-ta-${theme}::placeholder { color: ${c.placeholder}; }
        `}</style>

        {/* In-window contact banner */}
        <div style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
          background: c.bannerBg, borderBottom: c.bannerBorder, flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: c.avatarBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: c.avatarText, fontWeight: 700, fontSize: 14, flexShrink: 0,
            boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.4)',
          }}>JH</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: c.titleText }}>Justin's Bot</div>
            <div style={{ fontSize: 10.5, color: c.subText, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, boxShadow: c.dotGlow }} />
              online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{
          flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 14px 8px',
          background: c.msgsBg,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {messages.map((m, i) => {
            const mine = m.role === 'user';
            const isLastEmptyAssistant = !mine && !m.content && sending && i === messages.length - 1;
            return (
              <div key={i} style={{
                alignSelf: mine ? 'flex-end' : 'flex-start',
                maxWidth: '78%',
                background: mine ? c.mineBg : c.theirsBg,
                color: mine ? c.mineText : c.theirsText,
                border: mine ? c.mineBorder : c.theirsBorder,
                padding: '7px 12px', borderRadius: 14,
                borderBottomRightRadius: mine ? 4 : 14,
                borderBottomLeftRadius: mine ? 14 : 4,
                fontSize: 13, lineHeight: 1.45, whiteSpace: mine ? 'pre-wrap' : 'normal', wordBreak: 'break-word',
                boxShadow: c.bubbleShadow,
              }}>
                {isLastEmptyAssistant ? (
                  <span style={{ display: 'inline-flex', gap: 3, opacity: 0.8 }}>
                    <span style={{ animation: 'chatDots 1.2s infinite' }}>•</span>
                    <span style={{ animation: 'chatDots 1.2s infinite', animationDelay: '0.15s' }}>•</span>
                    <span style={{ animation: 'chatDots 1.2s infinite', animationDelay: '0.3s' }}>•</span>
                  </span>
                ) : (mine ? m.content : renderMarkdown(m.content, c))}

                {m.card === 'examples' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {EXAMPLES.map(q => (
                      <button key={q} onClick={() => send(q)} disabled={sending} style={{
                        font: 'inherit', fontSize: 12, lineHeight: 1.3, textAlign: 'left',
                        padding: '5px 10px', borderRadius: 999, cursor: sending ? 'default' : 'pointer',
                        background: c.chipBg, color: c.chipText, border: c.chipBorder,
                      }}>{q}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {form?.open && (
            <ContactForm c={c} theme={theme} form={form} setForm={setForm}
              onSubmit={submitContact} onCancel={() => setForm(null)} nameRef={nameRef} />
          )}
          {error && (
            <div style={{
              alignSelf: 'center', fontSize: 11, color: c.errText,
              background: c.errBg, padding: '6px 10px', borderRadius: 8,
              border: c.errBorder, marginTop: 4,
            }}>{error}</div>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: 10, display: 'flex', gap: 8, alignItems: 'center',
          background: c.barBg, borderTop: c.barBorder, flexShrink: 0,
        }}>
          <textarea ref={inputRef} className={`jh-chat-ta-${theme}`}
            value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
            placeholder="Ask about projects, experience, anything…" rows={1} disabled={sending}
            style={{
              flex: 1, resize: 'none', border: c.inputBorder, outline: 0,
              background: c.inputBg, color: c.inputText,
              padding: '8px 12px', borderRadius: 18, fontSize: 13, lineHeight: 1.4,
              fontFamily: 'inherit', maxHeight: 80,
            }} />
          <button onClick={() => send()} disabled={!input.trim() || sending} aria-label="Send" style={{
            width: 36, height: 36, borderRadius: '50%', border: 0,
            background: input.trim() && !sending ? c.sendOnBg : c.sendOffBg,
            color: input.trim() && !sending ? c.sendOnText : c.sendOffText,
            cursor: input.trim() && !sending ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    );
  };

  window.ChatApp = ChatApp;
})();
