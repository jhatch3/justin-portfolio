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
  // ─── Palettes ────────────────────────────────────────────────────────────
  // Two worlds, one component. `dark` is the macOS window on desktop.html;
  // `light` is the panel on landing.html and takes its values from that page's
  // tokens (var(--token, #fallback)) so the chat tracks the site rather than
  // approximating it.
  //
  // The reference is Messages: a solid canvas, two bubble fills, hairlines
  // instead of borders, and nothing else competing. What this replaced drew a
  // 2px outline around every bubble, which turned each turn into a form field
  // and made the transcript read as a stack of slabs.
  //
  // `canvas` is deliberately a flat colour, not a gradient: the bubble tails
  // are drawn with a pseudo-element that masks itself against the canvas, and a
  // gradient behind it would show the seam.
  const PALETTES = {
    dark: {
      font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      shellBg: '#0b0b0e',
      shellText: '#f5f5f7',
      // Translucent chrome over the transcript, the way a Messages title bar
      // sits over the conversation rather than beside it.
      bannerBg: 'rgba(22,22,26,0.72)',
      bannerBorder: '0.5px solid rgba(255,255,255,0.10)',
      avatarInk: '#dfe7f2',
      avatarBg: 'linear-gradient(165deg, #3a4354, #232834)',
      avatarRing: 'rgba(255,255,255,0.14)',
      titleText: '#f5f5f7',
      subText: 'rgba(235,235,245,0.58)',
      dot: '#30d158',
      dotGlow: '0 0 6px rgba(48,209,88,0.8)',
      canvas: '#0b0b0e',
      mineBg: '#0a84ff',
      mineText: '#ffffff',
      theirsBg: '#2a2a2e',
      theirsText: '#f5f5f7',
      meta: 'rgba(235,235,245,0.45)',
      errText: '#ff9a95',
      errBg: 'rgba(255,69,58,0.14)',
      errBorder: '0.5px solid rgba(255,69,58,0.32)',
      barBg: 'rgba(22,22,26,0.82)',
      barBorder: '0.5px solid rgba(255,255,255,0.08)',
      inputBg: 'rgba(255,255,255,0.07)',
      inputText: '#f5f5f7',
      inputBorder: '0.5px solid rgba(255,255,255,0.12)',
      placeholder: 'rgba(235,235,245,0.4)',
      sendOnBg: '#0a84ff',
      sendOnText: '#ffffff',
      sendOffBg: 'rgba(255,255,255,0.09)',
      sendOffText: 'rgba(235,235,245,0.35)',
      codeBg: 'rgba(255,255,255,0.12)',
      link: '#7ec0ff',
      chipBg: 'rgba(255,255,255,0.07)',
      chipText: '#f5f5f7',
      chipBorder: '0.5px solid rgba(255,255,255,0.14)',
      chipHover: 'rgba(255,255,255,0.13)',
      cardBg: '#1c1c20',
      cardBorder: '0.5px solid rgba(255,255,255,0.12)',
      cardShadow: '0 8px 28px rgba(0,0,0,0.45)',
      fieldBg: 'rgba(255,255,255,0.06)',
      fieldBorder: '0.5px solid rgba(255,255,255,0.14)',
      fieldFocus: '#0a84ff',
      fieldBad: '1px solid #ff9a95',
    },
    light: {
      font: 'inherit',
      shellBg: 'var(--surface, #ffffff)',
      shellText: 'var(--ink-2, #2a4365)',
      bannerBg: 'rgba(255,255,255,0.82)',
      bannerBorder: '0.5px solid rgba(10,37,64,0.09)',
      avatarInk: '#ffffff',
      avatarBg: 'linear-gradient(165deg, #3b73e8, #1d4ed8)',
      avatarRing: 'rgba(10,37,64,0.08)',
      titleText: 'var(--ink, #0a2540)',
      subText: 'var(--ink-3, #5a7090)',
      dot: '#22a15b',
      dotGlow: 'none',
      canvas: '#ffffff',
      mineBg: 'var(--accent, #1d4ed8)',
      mineText: '#ffffff',
      // A neutral carrying a little of the page's navy rather than a flat grey,
      // so the two bubble fills read as one family.
      theirsBg: '#eceef4',
      theirsText: 'var(--ink, #0a2540)',
      meta: 'var(--ink-3, #5a7090)',
      errText: '#b42318',
      errBg: 'rgba(180,35,24,0.07)',
      errBorder: '0.5px solid rgba(180,35,24,0.22)',
      barBg: 'rgba(255,255,255,0.88)',
      barBorder: '0.5px solid rgba(10,37,64,0.09)',
      inputBg: '#f2f3f7',
      inputText: 'var(--ink, #0a2540)',
      inputBorder: '0.5px solid rgba(10,37,64,0.10)',
      placeholder: 'var(--ink-3, #5a7090)',
      sendOnBg: 'var(--accent, #1d4ed8)',
      sendOnText: '#ffffff',
      sendOffBg: 'rgba(10,37,64,0.07)',
      sendOffText: 'rgba(10,37,64,0.32)',
      codeBg: 'rgba(10,37,64,0.07)',
      link: 'var(--accent, #1d4ed8)',
      chipBg: '#ffffff',
      chipText: 'var(--ink-2, #2a4365)',
      chipBorder: '0.5px solid rgba(10,37,64,0.14)',
      chipHover: '#f2f5fb',
      cardBg: '#ffffff',
      cardBorder: '0.5px solid rgba(10,37,64,0.12)',
      cardShadow: '0 6px 22px rgba(10,37,64,0.10)',
      fieldBg: '#f6f7fa',
      fieldBorder: '0.5px solid rgba(10,37,64,0.13)',
      fieldFocus: 'var(--accent, #1d4ed8)',
      fieldBad: '1px solid #b42318',
    },
  };

  // ─── Avatar ──────────────────────────────────────────────────────────────
  // An average face: symmetric, featureless in the way a composite is -
  // no hair, no jaw, nothing that resolves into a particular person. Built
  // from primitives rather than an image so it stays crisp at any size, takes
  // the palette with it, and costs nothing to load.
  //
  // The proportions are the boring ones on purpose: eyes on the horizontal
  // midline, mouth one eye-width below. That IS the average. Anything more
  // characterful would read as somebody instead of anybody.
  //
  // It also breathes and blinks. A face that holds perfectly still reads as a
  // logo; a slow scale and an occasional blink are the two cheapest signals
  // that there is someone home. Both are tiny on purpose. The point is to be
  // felt rather than watched, and all of it stops under prefers-reduced-motion.
  const Avatar = ({ c, size = 44, ring = true, thinking = false }) => (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* A halo that only exists while the bot is composing. It reads as
          "something is happening in there" without a spinner, which would
          look like the page was loading rather than the person was thinking. */}
      {thinking && (
        <span className="jh-halo" aria-hidden="true" style={{
          position: 'absolute', inset: -3, borderRadius: '50%',
          border: `2px solid ${c.dot}`, pointerEvents: 'none',
        }} />
      )}
      <div className={`jh-avatar${thinking ? ' jh-avatar-live' : ''}`} style={{
        position: 'relative',
        width: size, height: size, borderRadius: '50%',
        background: c.avatarBg, color: c.avatarInk,
        boxShadow: ring ? `0 0 0 0.5px ${c.avatarRing}, 0 1px 3px rgba(10,37,64,0.14)` : 'none',
        display: 'grid', placeItems: 'center', overflow: 'hidden',
      }}>
        <span className="jh-sheen" aria-hidden="true" style={{
          position: 'absolute', inset: '-25%', borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.5), rgba(255,255,255,0.12) 34%, transparent 58%)',
        }} />
        <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true"
          style={{ display: 'block' }}>
          {/* head */}
          <circle cx="24" cy="21.5" r="9.4" fill="currentColor" opacity="0.95" />
          {/* shoulders, a capsule cropped by the avatar's own circle */}
          <path d="M6.5 48c0-9.9 7.8-14.6 17.5-14.6S41.5 38.1 41.5 48z"
            fill="currentColor" opacity="0.95" />
          {/* Eyes on the midline, one eye-width apart, and a gentle arc for a
              mouth. Drawn at full strength rather than a whisper: this is only
              ever rendered at 32-40px, and at that size anything subtler stops
              resolving as a face and goes back to being a silhouette. */}
          <g className="jh-eyes">
            <circle className="jh-eye" cx="20.6" cy="20.3" r="1.6" fill="#16203a" opacity="0.92" />
            <circle className="jh-eye" cx="27.4" cy="20.3" r="1.6" fill="#16203a" opacity="0.92" />
          </g>
          <path d="M20.8 25.1c1.5 1.5 4.9 1.5 6.4 0" fill="none"
            stroke="#16203a" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );

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

  // ─── Intent, not commands ──────────────────────────────────────────────────
  // This used to be a command line bolted onto a chat: /projects, /experience,
  // /skills, /now, /hire, /resume, /help, /examples, /contact. Most of them
  // only ever expanded into a question the model could already answer if you
  // just asked it, so they earned their keep by teaching syntax nobody asked
  // to learn. Those are gone. Ask "what has he built" and it answers.
  //
  // Two things still can't be left to the model, because they aren't answers,
  // they're actions the window has to take:
  //
  //   contact  opens the message form
  //   help     describes what this thing is for
  //
  // Both are matched on intent. The patterns are deliberately narrow, because
  // a false positive here is worse than a miss: someone asking "did he build
  // an email system?" must not get a contact form. So "email him" matches and
  // a bare "email" in a sentence does not.
  const CONTACT_RE = new RegExp([
    // "message him", "email Justin", "talk to him"
    '\\b(?:contact|message|email|write to|writing to|talk to|speak to|speak with|reach)\\s+(?:him|justin)\\b',
    '\\bget in touch\\b',
    '\\breach out\\b',
    // "send him a message", "pass along a note", "leave a line"
    '\\b(?:send|pass|leave|drop)\\s+(?:him\\s+)?(?:a\\s+)?(?:message|note|line|email)\\b',
    '\\b(?:hire|work with)\\s+(?:him|justin)\\b',
    // the whole message is the request
    '^\\s*(?:contact|message|email|hire)\\s*[.!?]*\\s*$',
  ].join('|'), 'i');

  // Anchored on purpose. "help" is a request; "help me understand his ML work"
  // is a question, and should go to the model like any other.
  const HELP_RE = /^\s*(?:help|\?+|what can (?:you|i) (?:do|ask|tell me)|what do you do|how does this work|what is this)\s*[.!?]*\s*$/i;

  const HELP_TEXT = [
    "Ask me anything about Justin's work, his projects, or what he's after next.",
    '',
    'If you want to reach him, say so and a message form opens right here. The envelope next to the box does the same thing.',
  ].join('\n');

  // Every one of these is answerable straight from the ground-truth block,
  // which is the point: a suggestion the bot has to hedge on makes it look
  // worse than it is. Rendered as chips, so a visitor can pick one instead of
  // typing.
  const EXAMPLES = [
    'What is he building at Horizon Intelligence Labs?',
    'Which project should I actually look at?',
    'Has he shipped agents or RAG in production?',
    'What did he do at Modern Amenities?',
    'Is he open to new roles?',
    'Tell me something surprising about him.',
  ];
  const EXAMPLES_TEXT = 'Things I can answer well:';

  const CONTACT_FALLBACK = (window.JH_DATA?.links?.email?.href) || 'mailto:jjhatch03@gmail.com';
  const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // True only where there is a real pointer. Used to decide whether stealing
  // focus is cheap (a caret) or expensive (half the screen turning into a
  // keyboard, and iOS scrolling the page to chase the focused element).
  const finePointer = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Live media-query match. Re-renders on change, so rotating a phone or
  // dragging a window narrow re-picks rather than keeping whatever was true
  // when the component first mounted.
  const useMedia = (query) => {
    const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
    React.useEffect(() => {
      const mq = window.matchMedia(query);
      const onChange = (e) => setMatches(e.matches);
      setMatches(mq.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }, [query]);
    return matches;
  };

  const COMPOSER_MAX_H = 96;

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
        padding: '10px 12px', borderRadius: 11, outline: 0,
        background: c.fieldBg, color: c.inputText,
        border: form.bad.includes(k) ? c.fieldBad : c.fieldBorder,
        transition: 'border-color 0.16s',
        ...extra,
      },
    });

    return (
      <div style={{
        alignSelf: 'stretch', marginTop: 12, padding: 14, borderRadius: 16,
        background: c.cardBg, border: c.cardBorder, boxShadow: c.cardShadow,
        color: c.shellText, display: 'flex', flexDirection: 'column', gap: 9,
      }}>
        {/* The same face as the header, at card scale: this is the moment the
            visitor is actually addressing a person, so the person is on it. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar c={c} size={44} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 650, color: c.titleText, letterSpacing: '-0.01em' }}>
              {form.intent === 'hire' ? 'Tell Justin about the role' : 'Message Justin'}
            </div>
            <div style={{ fontSize: 11, color: c.subText, marginTop: 1 }}>
              Goes straight to his inbox.
            </div>
          </div>
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
          <button onClick={onSubmit} disabled={busy} className={`jh-chat-tap-${theme}`} style={{
            font: 'inherit', fontSize: 13, fontWeight: 600, padding: '8px 16px',
            borderRadius: 999, border: 0, cursor: busy ? 'default' : 'pointer',
            background: busy ? c.sendOffBg : c.sendOnBg,
            color: busy ? c.sendOffText : c.sendOnText,
          }}>{busy ? 'Sending…' : 'Send to Justin'}</button>
          <button onClick={onCancel} disabled={busy} className={`jh-chat-tap-${theme}`} style={{
            font: 'inherit', fontSize: 12.5, padding: '8px 12px', borderRadius: 999,
            border: 0, background: 'transparent', color: c.subText,
            cursor: busy ? 'default' : 'pointer',
          }}>Cancel</button>
          <a href={CONTACT_FALLBACK} className={`jh-chat-tap-${theme}`} style={{
            marginLeft: 'auto', fontSize: 11.5, color: c.link,
            display: 'inline-flex', alignItems: 'center',
          }}>
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
    // Same condition the touch-sizing rules in <style> below use, so the JS
    // and the CSS never disagree about which size the chat is running at.
    const narrow = useMedia('(pointer: coarse), (max-width: 640px)');
    const [messages, setMessages] = React.useState([
      { role: 'assistant', local: true, content: "I'm Justin's bot. Ask me about his work, his projects, or what he's looking for next.\n\nWant to reach him? Just say so." },
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

    React.useEffect(() => { if (finePointer()) inputRef.current?.focus(); }, []);

    const openComposer = (intent) => {
      setForm(f => ({
        open: true, intent,
        name: f?.name || '', email: f?.email || '', message: f?.message || '',
        // One less thing to type for the case that matters most.
        subject: f?.subject || (intent === 'hire' ? 'Hiring inquiry' : ''),
        company: '', status: 'idle', error: null, bad: [],
      }));
      // On touch the composer is scrolled into view by the effect above
      // instead: popping the keyboard the instant "Hire me" is tapped hides
      // the form the visitor just asked to see.
      if (finePointer()) setTimeout(() => nameRef.current?.focus(), 0);
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
        setForm(f => ({ ...f, bad, error: 'Needs a name, an email he can reply to, and a line or two.' }));
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
          content: `Off it goes. He'll reply to **${payload.email}**.\n\nAnything else while you're here?`,
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

      // Handled here rather than by the model: instant, free, and identical
      // every time. Both turns are marked local, so neither reaches the model
      // and neither skews the conversation it sees.
      const localReply = (content, card) => {
        setMessages(prev => [...prev,
          { role: 'user', local: true, content: text },
          { role: 'assistant', local: true, content, card },
        ]);
      };
      // Anyone who used this before, or who just expects a chat to have slash
      // commands, gets the behaviour they reached for. The syntax is not
      // documented anywhere any more, it simply still works.
      const intent = text.replace(/^\/+/, '').trim();
      if (HELP_RE.test(intent)) { localReply(HELP_TEXT, 'examples'); return; }
      if (CONTACT_RE.test(intent)) {
        localReply('Fill this in and it goes straight to him.');
        openComposer(/\b(?:hire|work with)\b/i.test(intent) ? 'hire' : 'chat');
        return;
      }

      const next = [...messages,
        { role: 'user', content: text },
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

    // Stamped once, when the thread opens, and never recomputed - the label
    // dates the conversation, so it should not tick over while you read it.
    const [openedAt] = React.useState(() =>
      new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));

    // Index of the most recent thing the visitor sent, or -1. The receipt
    // hangs off that and nothing else.
    const deliveredIdx = React.useMemo(() => {
      for (let i = messages.length - 1; i >= 0; i--) if (messages[i].role === 'user') return i;
      return -1;
    }, [messages]);

    // Grow the composer to fit what's in it. Reset to `auto` first so it can
    // shrink again when text is deleted - scrollHeight never reports smaller
    // than the current height.
    const fitComposer = (el) => {
      if (!el) return;
      el.style.height = 'auto';
      // scrollHeight is the padding-box height, but `* { box-sizing: border-box }`
      // means style.height sets the BORDER-box height. Without the border back
      // the content area lands one border short top and bottom, so the box stays
      // permanently scrollable and clips the last line by ~2px.
      const border = el.offsetHeight - el.clientHeight;
      el.style.height = Math.min(el.scrollHeight + border, COMPOSER_MAX_H) + 'px';
    };
    const onInput = (e) => { setInput(e.target.value); fitComposer(e.target); };
    // Re-measure whenever the value changes (sending clears it, so the box has
    // to come back down) and whenever `narrow` flips, because that swaps the
    // font size out from under an explicit pixel height. Unconditional: gating
    // this on `!input` skipped the one case the `narrow` dependency is here for
    // - text already in the box when the size changes under it.
    React.useEffect(() => { fitComposer(inputRef.current); }, [input, narrow]);

    return (
      <div className={`jh-chat-${theme}`} style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: c.shellBg, color: c.shellText, fontFamily: c.font,
      }}>
        <style>{`
          .jh-chat-${theme} {
            --jhc-canvas: ${c.canvas};
            --jhc-mine: ${c.mineBg};
            --jhc-theirs: ${c.theirsBg};
          }
          @keyframes chatDots  { 0%, 60%, 100% { transform: translateY(0); opacity: 0.45 }
                                 30% { transform: translateY(-3px); opacity: 1 } }

          /* ── The face is alive ──────────────────────────────────────────
             Three signals, all deliberately small. A slow breath so it is
             never perfectly still, a blink on a slightly off interval so it
             never looks metronomic, and a halo that only appears while the
             bot is actually composing a reply. */
          @keyframes jhBreathe { 0%, 100% { transform: scale(1) }
                                 50%      { transform: scale(1.055) } }
          /* 96% of the cycle open, then shut and back. Fast, because a slow
             blink looks like the thing is falling asleep. */
          @keyframes jhBlink   { 0%, 93%, 100% { transform: scaleY(1) }
                                 96%           { transform: scaleY(0.08) } }
          @keyframes jhHalo    { 0%   { transform: scale(1);    opacity: 0.5 }
                                 100% { transform: scale(1.55); opacity: 0 } }

          /* A light travelling round the head. This is the one that makes the
             face read as live at a glance instead of on inspection. */
          @keyframes jhSheen   { to { transform: rotate(360deg) } }
          /* Eyes wander, settle, wander back. Never to the same beat as the
             blink, so the two never line up into a tic. */
          @keyframes jhGlance  { 0%, 26%, 100% { transform: translateX(0) }
                                 34%, 48%      { transform: translateX(1px) }
                                 56%, 72%      { transform: translateX(-1px) }
                                 80%           { transform: translateX(0) } }

          .jh-avatar { animation: jhBreathe 3.8s ease-in-out infinite; will-change: transform; }
          /* Thinking quickens the breath. Nobody will name it. Everybody
             registers it. */
          .jh-avatar-live { animation-duration: 1.9s; }
          .jh-avatar-live .jh-sheen { animation-duration: 2.4s; }
          .jh-halo  { animation: jhHalo 1.7s ease-out infinite; }
          .jh-sheen { animation: jhSheen 7s linear infinite; }
          /* transform-box makes each shape its own origin, so the lid closes
             over the pupil instead of the SVG rotating about 0,0. */
          .jh-eyes {
            transform-box: fill-box; transform-origin: center;
            animation: jhGlance 7.5s ease-in-out infinite;
          }
          .jh-eye {
            transform-box: fill-box; transform-origin: center;
            animation: jhBlink 3.9s ease-in-out infinite;
          }
          @keyframes chatIn    { from { opacity: 0; transform: translateY(6px) scale(0.97) }
                                 to   { opacity: 1; transform: none } }
          .jh-chat-ta-${theme}::placeholder { color: ${c.placeholder}; }
          .jh-chat-ta-${theme}:focus { border-color: ${c.fieldFocus}; }

          /* Every turn arrives rather than appearing. Short and once - the
             transcript should feel alive, not animated. */
          .jh-chat-bub-${theme} { animation: chatIn 0.22s cubic-bezier(.22,.9,.3,1) both; }

          /* ── Bubble tails ──────────────────────────────────────────────
             The single detail that makes a transcript read as Messages
             rather than as a list of cards. Two pseudo-elements: the first
             extends the bubble's fill out past its corner, the second masks
             that extension back with the canvas colour, leaving the curl.
             This is why 'canvas' has to be a flat colour - a gradient behind
             the mask would show the seam. Only the last bubble of a run gets
             one, which is what makes a run read as one utterance. */
          .jh-chat-bub-${theme}::before,
          .jh-chat-bub-${theme}::after { content: none; }
          .jh-chat-bub-${theme}.jh-tail::before,
          .jh-chat-bub-${theme}.jh-tail::after {
            content: ''; position: absolute; bottom: 0; width: 18px; height: 18px;
          }
          .jh-chat-bub-${theme}.jh-tail.jh-mine::before {
            right: -7px; background: var(--jhc-mine); border-bottom-left-radius: 15px;
          }
          .jh-chat-bub-${theme}.jh-tail.jh-mine::after {
            right: -7px; width: 9px; background: var(--jhc-canvas); border-bottom-left-radius: 9px;
          }
          .jh-chat-bub-${theme}.jh-tail.jh-theirs::before {
            left: -7px; background: var(--jhc-theirs); border-bottom-right-radius: 15px;
          }
          .jh-chat-bub-${theme}.jh-tail.jh-theirs::after {
            left: -7px; width: 9px; background: var(--jhc-canvas); border-bottom-right-radius: 9px;
          }

          .jh-chat-chip-${theme} { transition: background 0.14s, transform 0.14s; }
          @media (hover: hover) and (pointer: fine) {
            .jh-chat-chip-${theme}:hover:not(:disabled) { background: ${c.chipHover}; transform: translateY(-1px); }
            .jh-chat-send-${theme}:not(:disabled):hover { filter: brightness(1.08); }
          }
          .jh-chat-send-${theme} { transition: background 0.16s, color 0.16s, transform 0.16s, filter 0.16s; }
          .jh-chat-send-${theme}:not(:disabled):active { transform: scale(0.92); }

          @media (prefers-reduced-motion: reduce) {
            .jh-chat-bub-${theme}, .jh-chat-chip-${theme}, .jh-chat-send-${theme} {
              animation-duration: 0.01ms !important; transition-duration: 0.01ms !important;
            }
            /* The face holds still. Breathing and blinking are charm, and
               charm is exactly what someone asking for reduced motion has
               said they do not want. */
            .jh-avatar, .jh-eye, .jh-eyes, .jh-sheen { animation: none !important; }
            .jh-halo { animation: none !important; opacity: 0.4; }
          }

          /* Touch sizing.
             The font-size rule is not cosmetic: iOS Safari zooms the whole
             page in whenever a focused field's text is under 16px, and it
             does not zoom back out afterwards. Every field here was 13px, so
             tapping the composer left the visitor stranded on a page scaled
             up past its own width - which is what "the chat button is buggy
             on my phone" looks like from the outside. !important because the
             fields set their size inline, and inline beats a stylesheet.
             The rest is just honest touch targets: 13px chat text and a 36px
             send button are fine under a mouse and small under a thumb. */
          @media (pointer: coarse), (max-width: 640px) {
            .jh-chat-ta-${theme} { font-size: 16px !important; }
            .jh-chat-msg-${theme} { font-size: 15px !important; line-height: 1.5 !important; }
            .jh-chat-send-${theme} { width: 44px !important; height: 44px !important; }
            .jh-chat-tap-${theme} { min-height: 44px !important; }
            /* Chips wrap into a row, so they grow by padding rather than by a
               min-height that would leave a stack of tall slabs. */
            .jh-chat-chip-${theme} { font-size: 14px !important; padding: 9px 14px !important; }
          }
        `}</style>

        {/* ── Conversation header ────────────────────────────────────────
            Messages stacks the contact above the thread rather than putting
            it in a left-aligned row - the avatar centred, the name under it,
            the status under that. It reads as "who you are talking to",
            which is what a header is for, instead of as a support widget.
            The right padding keeps it clear of landing.html's window chrome,
            which floats over this corner. */}
        <div style={{
          padding: '16px 56px 13px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 9, flexShrink: 0,
          background: c.bannerBg, borderBottom: c.bannerBorder,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}>
          <Avatar c={c} size={68} thinking={sending} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <div style={{
              fontSize: 15.5, fontWeight: 650, color: c.titleText,
              letterSpacing: '-0.02em', lineHeight: 1.2,
            }}>Justin's Bot</div>
            <div style={{
              fontSize: 10.5, color: c.subText, display: 'flex', alignItems: 'center', gap: 4.5,
            }}>
              <span style={{
                width: 5.5, height: 5.5, borderRadius: '50%',
                background: c.dot, boxShadow: c.dotGlow,
              }} />
              online
            </div>
          </div>
        </div>

        {/* ── Transcript ─────────────────────────────────────────────────
            overscrollBehavior: once this hits its end the gesture stops here
            rather than carrying on into the page behind the panel. */}
        <div ref={scrollRef} style={{
          flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch', padding: '10px 14px 10px',
          background: c.canvas,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* One time stamp at the top of the thread, the way Messages dates a
              conversation once instead of labelling every line. */}
          <div style={{
            alignSelf: 'center', margin: '2px 0 12px',
            fontSize: 10.5, fontWeight: 600, color: c.meta,
            letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums',
          }}>{openedAt}</div>

          {messages.map((m, i) => {
            const mine = m.role === 'user';
            const prev = messages[i - 1], next = messages[i + 1];
            // A run is consecutive turns from the same speaker. Within a run
            // the bubbles sit 2px apart with squared inner corners so they
            // read as one utterance; only the last one gets a tail.
            const runStart = !prev || (prev.role === 'user') !== mine;
            const runEnd = !next || (next.role === 'user') !== mine;
            const typing = !mine && !m.content && sending && i === messages.length - 1;
            const R = 17, TUCK = 6;
            return (
              <React.Fragment key={i}>
              <div
                className={`jh-chat-msg-${theme} jh-chat-bub-${theme} ${runEnd ? 'jh-tail' : ''} ${mine ? 'jh-mine' : 'jh-theirs'}`}
                style={{
                  position: 'relative',
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  // A bubble may not be wider than its column; long URLs and
                  // repo paths wrap instead of stretching the panel.
                  maxWidth: '78%', minWidth: 0,
                  marginTop: runStart ? (i === 0 ? 0 : 10) : 2,
                  background: mine ? c.mineBg : c.theirsBg,
                  color: mine ? c.mineText : c.theirsText,
                  padding: typing ? '11px 14px' : '8px 13px',
                  borderRadius: R,
                  borderTopRightRadius:    mine && !runStart ? TUCK : R,
                  borderBottomRightRadius: mine && !runEnd   ? TUCK : R,
                  borderTopLeftRadius:    !mine && !runStart ? TUCK : R,
                  borderBottomLeftRadius: !mine && !runEnd   ? TUCK : R,
                  fontSize: 14, lineHeight: 1.45,
                  whiteSpace: mine ? 'pre-wrap' : 'normal', wordBreak: 'break-word',
                }}>
                {typing ? (
                  <span style={{ display: 'flex', gap: 4, alignItems: 'center' }} aria-label="Typing">
                    {[0, 0.16, 0.32].map(d => (
                      <span key={d} style={{
                        width: 6.5, height: 6.5, borderRadius: '50%', background: 'currentColor',
                        animation: `chatDots 1.3s ${d}s infinite ease-in-out`,
                      }} />
                    ))}
                  </span>
                ) : (mine ? m.content : renderMarkdown(m.content, c))}

                {m.card === 'examples' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                    {EXAMPLES.map(q => (
                      <button key={q} onClick={() => send(q)} disabled={sending}
                        className={`jh-chat-chip-${theme}`} style={{
                        font: 'inherit', fontSize: 12.5, lineHeight: 1.35, textAlign: 'left',
                        padding: '8px 12px', borderRadius: 13, cursor: sending ? 'default' : 'pointer',
                        background: c.chipBg, color: c.chipText, border: c.chipBorder,
                      }}>{q}</button>
                    ))}
                  </div>
                )}
              </div>
              {/* Messages hangs a delivery receipt under the last thing you
                  sent, and only there - under that message, not at the foot
                  of the thread. It is the smallest possible "that went
                  through". */}
              {i === deliveredIdx && !sending && (
                <div style={{
                  alignSelf: 'flex-end', marginTop: 3, paddingRight: 4,
                  fontSize: 10, fontWeight: 600, color: c.meta, letterSpacing: '0.02em',
                }}>Delivered</div>
              )}
              </React.Fragment>
            );
          })}

          {form?.open && (
            <ContactForm c={c} theme={theme} form={form} setForm={setForm}
              onSubmit={submitContact} onCancel={() => setForm(null)} nameRef={nameRef} />
          )}
          {error && (
            <div style={{
              alignSelf: 'center', fontSize: 11.5, color: c.errText,
              background: c.errBg, padding: '7px 11px', borderRadius: 10,
              border: c.errBorder, marginTop: 8,
            }}>{error}</div>
          )}
        </div>

        {/* ── Composer ───────────────────────────────────────────────────
            A pill on a translucent bar, and a send button that is only there
            when there is something to send - Messages fades its arrow in on
            the first keystroke rather than parking a dead control beside an
            empty field. */}
        <div style={{
          padding: '9px 10px', display: 'flex', gap: 8, alignItems: 'flex-end',
          background: c.barBg, borderTop: c.barBorder, flexShrink: 0,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}>
          {/* The always-there way to the form. With the commands gone, typed
              intent is one path in and this is the other, so reaching him
              never depends on guessing the right phrase. */}
          <button onClick={() => openComposer('chat')}
            aria-label="Message Justin" title="Message Justin"
            className={`jh-chat-send-${theme}`} style={{
              width: 34, height: 34, borderRadius: '50%', border: 0, padding: 0,
              background: c.sendOffBg, color: c.subText, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginBottom: 1,
            }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
              <path d="m21 7.5-8.5 5.4a1.8 1.8 0 0 1-2 0L2 7.5" />
            </svg>
          </button>

          {/* A one-row textarea clips anything that wraps. The placeholder is
              short enough to fit on one line in the narrowest place this runs,
              which is a 380px panel carrying two buttons, so it never needs a
              width-dependent variant. The box itself grows with what is typed,
              up to COMPOSER_MAX_H, after which it scrolls. */}
          <textarea ref={inputRef} className={`jh-chat-ta-${theme}`}
            value={input} onChange={onInput} onKeyDown={onKey}
            placeholder="Ask about his work…"
            rows={1} disabled={sending}
            style={{
              flex: 1, minWidth: 0, resize: 'none', border: c.inputBorder, outline: 0,
              background: c.inputBg, color: c.inputText,
              padding: '9px 14px', borderRadius: 19, fontSize: 13.5, lineHeight: 1.4,
              fontFamily: 'inherit', maxHeight: COMPOSER_MAX_H, overflowY: 'auto',
              transition: 'border-color 0.16s',
            }} />
          <button onClick={() => send()} disabled={!input.trim() || sending} aria-label="Send"
            className={`jh-chat-send-${theme}`} style={{
            width: 34, height: 34, borderRadius: '50%', border: 0, padding: 0,
            background: input.trim() && !sending ? c.sendOnBg : c.sendOffBg,
            color: input.trim() && !sending ? c.sendOnText : c.sendOffText,
            cursor: input.trim() && !sending ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transform: input.trim() && !sending ? 'scale(1)' : 'scale(0.86)',
            opacity: input.trim() && !sending ? 1 : 0.55,
            marginBottom: 1,
          }}>
            {/* An arrow, not a paper plane - the plane reads as "email", and
                this sends a message. */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="19" x2="12" y2="6" />
              <polyline points="6 12 12 5.6 18 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  window.ChatApp = ChatApp;
})();
