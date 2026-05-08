// mobile.jsx - iOS-style home screen for phones, mirrors the macOS desktop concept.
// Boots with chat already open (the highest-engagement app), tap close to see the
// iOS home screen with all the other "apps" (sections of Justin's portfolio).

const { useState: mS, useEffect: mE, useRef: mR } = React;
const PD = window.JH_DATA;

// ─── useMediaQuery ───────────────────────────────────────────────────────────
const useMediaQuery = (query) => {
  const [matches, setMatches] = mS(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  mE(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

// ─── Status bar (time, signal, battery, dynamic island) ──────────────────────
const StatusBar = ({ light = true }) => {
  const [time, setTime] = mS(() => fmtTime(new Date()));
  mE(() => {
    const id = setInterval(() => setTime(fmtTime(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);
  const c = light ? 'white' : '#1d1d1f';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
      paddingTop: 'calc(env(safe-area-inset-top, 12px) + 4px)',
      paddingLeft: 24, paddingRight: 24, paddingBottom: 6,
      display: 'flex', alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      color: c, fontWeight: 600, fontSize: 15,
      pointerEvents: 'none',
    }}>
      <div style={{ flex: 1, fontVariantNumeric: 'tabular-nums', textAlign: 'left' }}>{time}</div>
      <div style={{ flex: 1 }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
        {/* Signal bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}><rect x="0"  y="7" width="3" height="4" rx="0.5"/><rect x="5"  y="5" width="3" height="6" rx="0.5"/><rect x="10" y="3" width="3" height="8" rx="0.5"/><rect x="15" y="0" width="3" height="11" rx="0.5" opacity="0.4"/></svg>
        {/* Wi-Fi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill={c}><path d="M7.5 1c2.6 0 5 .9 6.9 2.4l-1 1.2A8.7 8.7 0 0 0 7.5 2.6 8.7 8.7 0 0 0 1.6 4.6l-1-1.2A11 11 0 0 1 7.5 1zm0 3a7.4 7.4 0 0 1 4.7 1.7l-1 1.2a5.6 5.6 0 0 0-3.7-1.4 5.6 5.6 0 0 0-3.7 1.4l-1-1.2A7.4 7.4 0 0 1 7.5 4zm0 3c1 0 1.9.3 2.6.9L7.5 11 4.9 7.9c.7-.6 1.6-.9 2.6-.9z"/></svg>
        {/* Battery */}
        <svg width="26" height="11" viewBox="0 0 26 11" fill="none" stroke={c} strokeWidth="0.8">
          <rect x="0.5" y="0.5" width="22" height="10" rx="2.5"/>
          <rect x="2.5" y="2.5" width="18" height="6" rx="1" fill={c} stroke="none"/>
          <rect x="23" y="3.5" width="2" height="4" rx="1" fill={c} stroke="none" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
};
function fmtTime(d) {
  let h = d.getHours(), m = d.getMinutes();
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')}`;
}

// ─── Home indicator (cosmetic) ───────────────────────────────────────────────
const HomeIndicator = ({ light = true }) => (
  <div style={{
    position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)',
    left: '50%', transform: 'translateX(-50%)', width: 130, height: 5, borderRadius: 3,
    background: light ? 'white' : 'rgba(0,0,0,0.6)', opacity: 0.92, zIndex: 30,
    pointerEvents: 'none',
  }} />
);

// ─── Brand / app SVG icons ───────────────────────────────────────────────────
const RobotMark = (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1a1f2e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="3" x2="12" y2="5.5" />
    <circle cx="12" cy="2.4" r="1" fill="#1a1f2e" stroke="none" />
    <rect x="5" y="5.5" width="14" height="13" rx="3.2" />
    <circle cx="9" cy="11.4" r="1.35" fill="#1a1f2e" stroke="none" />
    <circle cx="15" cy="11.4" r="1.35" fill="#1a1f2e" stroke="none" />
    <path d="M9 14.8 h6" />
    <line x1="3.2" y1="11" x2="5" y2="11" />
    <line x1="19" y1="11" x2="20.8" y2="11" />
  </svg>
);
const IOSGitHubMark = (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.8.55C20.71 21.39 24 17.07 24 12 24 5.65 18.85.5 12.5.5H12z"/>
  </svg>
);
const IOSLinkedInMark = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
  </svg>
);

// ─── Apps registry for iOS home ──────────────────────────────────────────────
// Items with `href` open externally in a new tab; items without open as in-app sheets.
const IOS_APPS = [
  { id: 'chat',       label: "Justin's Bot", icon: RobotMark, bg: 'linear-gradient(160deg, #d4e3f5, #8eb4d8)', fg: 'white' },
  { id: 'about',      label: 'About',        icon: '◐',  bg: 'linear-gradient(160deg, #7ec0ff, #0a84ff)', fg: 'white' },
  { id: 'projects',   label: 'Projects',     icon: '▦',  bg: 'linear-gradient(160deg, #ffd479, #ff9500)', fg: 'white' },
  { id: 'experience', label: 'Experience',   icon: '≡',  bg: 'linear-gradient(160deg, #d4d4d9, #86868b)', fg: 'white' },
  { id: 'skills',     label: 'Stack',        icon: '◇',  bg: 'linear-gradient(160deg, #b78dff, #5e3fbe)', fg: 'white' },
  { id: 'writing',    label: 'Writing',      icon: '✎',  bg: 'linear-gradient(160deg, #fff2c8, #f8d764)', fg: '#5a4a00' },
  { id: 'now',        label: 'Now',          icon: '▷',  bg: 'linear-gradient(160deg, #2c2c2e, #1c1c1e)', fg: '#a8c896' },
  { id: 'mail',       label: 'Mail',         icon: '✉',  bg: 'linear-gradient(160deg, #7ec0ff, #007aff)', fg: 'white' },
  { id: 'resume',     label: 'Resume',       icon: '⎙',  bg: 'linear-gradient(160deg, #ff8a8a, #ff3b30)', fg: 'white' },
  { id: 'github',     label: 'GitHub',       icon: IOSGitHubMark,   bg: 'linear-gradient(160deg, #2a2a2e, #0d0d10)', fg: 'white', href: PD.links?.github?.href },
  { id: 'linkedin',   label: 'LinkedIn',     icon: IOSLinkedInMark, bg: 'linear-gradient(160deg, #2c8ed6, #0a66c2)', fg: 'white', href: PD.links?.linkedin?.href },
];
const IOS_DOCK = ['chat', 'mail', 'projects', 'resume'];

// ─── App icon ────────────────────────────────────────────────────────────────
const AppIcon = ({ app, size = 60, label = true, onTap }) => {
  const isText = typeof app.icon === 'string';
  return (
    <button onClick={() => onTap(app)} aria-label={app.label} style={{
      background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit',
    }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.226,
        background: app.bg, color: app.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isText ? (app.size || 30) : undefined,
        fontWeight: isText ? (app.weight || 600) : undefined,
        boxShadow: '0 6px 14px rgba(0,0,0,0.25), inset 0 0.5px 0 rgba(255,255,255,0.4)',
        border: '0.5px solid rgba(0,0,0,0.1)',
        letterSpacing: isText && app.size && app.size < 30 ? '-0.02em' : 0,
      }}>{app.icon}</div>
      {label && (
        <div style={{
          fontSize: 12, color: 'white', textShadow: '0 2px 6px rgba(0,0,0,0.55)',
          fontWeight: 500, letterSpacing: 0.1, maxWidth: size + 24,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          textAlign: 'center',
        }}>{app.label}</div>
      )}
    </button>
  );
};

// ─── iOS Home screen ─────────────────────────────────────────────────────────
const IOSHome = ({ onOpen }) => {
  const dockApps = IOS_DOCK.map(id => IOS_APPS.find(a => a.id === id)).filter(Boolean);
  const gridApps = IOS_APPS.filter(a => !IOS_DOCK.includes(a.id));
  // Click handler: external links open in a new tab; everything else opens as in-app sheet.
  const handleTap = (app) => {
    if (app.href) window.open(app.href, '_blank', 'noopener,noreferrer');
    else onOpen(app.id);
  };
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 56px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
    }}>
      <StatusBar />
      {/* Hero (eyebrow + name) */}
      <div style={{
        textAlign: 'center', padding: '4px 24px 18px',
        textShadow: '0 4px 24px rgba(0,0,0,0.45)', flexShrink: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.85)', marginBottom: 6,
        }}>{PD.role}</div>
        <div style={{
          fontSize: 34, fontWeight: 600, letterSpacing: '-0.025em',
          color: 'white', lineHeight: 1.05,
        }}>{PD.name}</div>
      </div>
      {/* App grid */}
      <div style={{
        flex: 1, padding: '0 22px', display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridAutoRows: 'min-content', gap: '22px 12px',
        alignContent: 'start',
      }}>
        {gridApps.map(a => <AppIcon key={a.id} app={a} onTap={handleTap} />)}
      </div>
      {/* Dock */}
      <div style={{
        margin: '8px 14px 0', padding: '10px 8px',
        borderRadius: 32,
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '0.5px solid rgba(255,255,255,0.22)',
        display: 'grid', gridTemplateColumns: `repeat(${dockApps.length}, 1fr)`, gap: 8,
      }}>
        {dockApps.map(a => <AppIcon key={a.id} app={a} onTap={handleTap} />)}
      </div>
      <HomeIndicator />
    </div>
  );
};

// ─── App view shell (full-screen, with close chevron) ────────────────────────
const IOSAppView = ({ title, onClose, theme = 'light', children }) => {
  const dark = theme === 'dark';
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: dark ? '#0d0d10' : '#f2f2f4',
      color: dark ? '#f5f5f7' : '#1d1d1f',
      animation: 'iosAppIn 0.22s cubic-bezier(.2,.8,.3,1)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    }}>
      <style>{`
        @keyframes iosAppIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes chatDots { 0% { opacity: 0.3 } 30% { opacity: 1 } 60%, 100% { opacity: 0.3 } }
      `}</style>
      <StatusBar light={dark} />
      {/* Header */}
      <div style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 44px)',
        padding: 'calc(env(safe-area-inset-top, 0px) + 44px) 16px 8px',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        background: dark ? 'rgba(13,13,16,0.92)' : 'rgba(242,242,244,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.08)',
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          width: 32, height: 32, borderRadius: '50%',
          background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          border: 0, cursor: 'pointer', color: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 5 7 9 11 5"/></svg>
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 600, marginRight: 32 }}>{title}</div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>
      <HomeIndicator light={dark} />
    </div>
  );
};

// ─── Chat (full-screen, instant SSE) ─────────────────────────────────────────
const IOSChat = ({ onClose }) => {
  const [messages, setMessages] = mS([
    { role: 'assistant', content: "Hey - I'm Justin's bot. Ask me anything about his work, projects, or what he's looking for next." },
  ]);
  const [input, setInput] = mS('');
  const [sending, setSending] = mS(false);
  const [error, setError] = mS(null);
  const scrollRef = mR(null);
  mE(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, sending]);

  const sendText = async (text) => {
    text = text.trim();
    if (!text || sending) return;
    setInput('');
    setError(null);
    const next = [...messages, { role: 'user', content: text }, { role: 'assistant', content: '' }];
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
      const payload = next.filter(m => !(m.role === 'assistant' && m.content === '')).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: payload }), signal: ctl.signal });
      clearTimeout(connectTimer);
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.message || `HTTP ${res.status}`); }
      if (!res.body) throw new Error('no body');
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
            setMessages(prev => { const c = prev.slice(); c[c.length - 1] = { role: 'assistant', content: c[c.length - 1].content + evt.text }; return c; });
          } else if (evt.type === 'error') {
            throw new Error(evt.message || 'stream error');
          }
        }
      }
    } catch (e) {
      const reason = e?.message || String(e);
      const friendly = timeoutReason === 'connect_timeout' ? "Couldn't reach the server in 15s." : timeoutReason === 'stall_timeout' ? "The server stopped responding." : reason;
      setError(friendly);
      setMessages(prev => { const c = prev.slice(); if (c.length && c[c.length - 1].role === 'assistant' && !c[c.length - 1].content) c.pop(); return c; });
    } finally {
      clearTimeout(connectTimer);
      if (stallTimer) clearTimeout(stallTimer);
      setSending(false);
    }
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(input); } };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column',
      background: 'rgba(20,20,22,0.98)', color: '#f5f5f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      animation: 'iosAppIn 0.22s cubic-bezier(.2,.8,.3,1)',
    }}>
      <StatusBar light />
      {/* Header */}
      <div style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 42px)',
        padding: 'calc(env(safe-area-inset-top, 0px) + 42px) 14px 10px',
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#0c1018',
        borderBottom: '0.5px solid rgba(184,212,240,0.18)',
        borderBottom: '0.5px solid rgba(0,0,0,0.3)', flexShrink: 0,
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)', border: 0, cursor: 'pointer', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 5 7 9 11 5"/></svg>
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(160deg, #d4e3f5, #8eb4d8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#1a1f2e', fontWeight: 700, fontSize: 14, flexShrink: 0,
          boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.4)',
        }}>JH</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Justin's Bot</div>
          <div style={{ fontSize: 11, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158', boxShadow: '0 0 6px #30d158' }} />
            online · ask anything about Justin
          </div>
        </div>
      </div>
      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {messages.map((m, i) => {
          const mine = m.role === 'user';
          const isLastEmptyAssistant = !mine && !m.content && sending && i === messages.length - 1;
          return (
            <div key={i} style={{
              alignSelf: mine ? 'flex-end' : 'flex-start',
              maxWidth: '82%',
              background: mine ? '#b8d4f0' : 'rgba(40,44,54,0.95)',
              color: mine ? '#0a1020' : '#f5f5f7',
              padding: '8px 12px', borderRadius: 16,
              borderBottomRightRadius: mine ? 4 : 16, borderBottomLeftRadius: mine ? 16 : 4,
              fontSize: 14, lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
            }}>
              {isLastEmptyAssistant ? (
                <span style={{ display: 'inline-flex', gap: 3, opacity: 0.8 }}>
                  <span style={{ animation: 'chatDots 1.2s infinite' }}>•</span>
                  <span style={{ animation: 'chatDots 1.2s infinite', animationDelay: '0.15s' }}>•</span>
                  <span style={{ animation: 'chatDots 1.2s infinite', animationDelay: '0.3s' }}>•</span>
                </span>
              ) : m.content}
            </div>
          );
        })}
        {error && <div style={{ alignSelf: 'center', fontSize: 11, color: '#ff8a85', background: 'rgba(255,69,58,0.12)', padding: '6px 10px', borderRadius: 8, border: '0.5px solid rgba(255,69,58,0.3)', marginTop: 4 }}>{error}</div>}
      </div>
      {/* Input */}
      <div style={{
        padding: '8px 10px calc(env(safe-area-inset-bottom, 0px) + 12px)',
        display: 'flex', gap: 8, alignItems: 'center',
        background: 'rgba(28,28,30,0.85)', borderTop: '0.5px solid rgba(255,255,255,0.06)', flexShrink: 0,
      }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
          placeholder="Message Justin's bot…" rows={1} disabled={sending}
          style={{
            flex: 1, resize: 'none', border: 0, outline: 0,
            background: 'rgba(255,255,255,0.08)', color: '#f5f5f7',
            padding: '10px 14px', borderRadius: 22, fontSize: 16, lineHeight: 1.4,
            fontFamily: 'inherit', maxHeight: 90,
          }} />
        <button onClick={() => sendText(input)} disabled={!input.trim() || sending} aria-label="Send" style={{
          width: 38, height: 38, borderRadius: '50%', border: 0,
          background: input.trim() && !sending ? '#b8d4f0' : 'rgba(255,255,255,0.12)',
          color: input.trim() && !sending ? '#0a1020' : 'rgba(255,255,255,0.4)',
          cursor: input.trim() && !sending ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  );
};

// ─── Content app views (light theme) ─────────────────────────────────────────
const Pad = ({ children }) => <div style={{ padding: '14px 18px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>;
const Card = ({ children, dark, style }) => (
  <div style={{
    background: dark ? 'rgba(28,28,30,0.95)' : 'white',
    color: dark ? '#a8c896' : '#1d1d1f',
    borderRadius: 14, padding: 16,
    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
    ...style,
  }}>{children}</div>
);
const Eyebrow = ({ children, color }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: color || 'rgba(0,0,0,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{children}</div>
);

const IOSAbout = ({ onClose }) => (
  <IOSAppView title="About" onClose={onClose}>
    <Pad>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '12px 0' }}>
        <img src="justin.jpg" alt={PD.name} style={{ width: 110, height: 110, borderRadius: 26, objectFit: 'cover', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }} />
        <Eyebrow>{PD.role}</Eyebrow>
        <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.05 }}>{PD.name}</div>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: 'rgba(0,0,0,0.55)' }}>{PD.location} · graduating {PD.graduating}</div>
      </div>
      <Card>
        <Eyebrow>About</Eyebrow>
        {(PD.about || []).map((p, i) => <p key={i} style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.55, color: 'rgba(0,0,0,0.78)' }}>{p}</p>)}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          {(PD.honors || []).map(h => <span key={h} style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.7)' }}>{h}</span>)}
        </div>
      </Card>
    </Pad>
  </IOSAppView>
);

const IOSProjects = ({ onClose }) => {
  const [open, setOpen] = mS(null);
  return (
    <IOSAppView title="Projects" onClose={onClose}>
      <Pad>
        {(PD.projects || []).map((p, i) => {
          const isOpen = open === i;
          const stack = p.stack || p.tags || [];
          const bullets = p.bullets || p.points || [];
          return (
            <div key={i} style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
              <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 0, padding: 16, cursor: 'pointer', fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f', flex: 1 }}>{p.name}</div>
                  <span style={{ fontSize: 18, color: 'rgba(0,0,0,0.4)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }}>›</span>
                </div>
                {p.subtitle && <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', lineHeight: 1.4 }}>{p.subtitle}</div>}
                {stack.length > 0 && <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>{stack.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.7)' }}>{t}</span>)}</div>}
              </button>
              {isOpen && (bullets.length > 0 || p.url) && (
                <div style={{ padding: '0 16px 16px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(0,0,0,0.78)', marginTop: 12 }}>
                    {bullets.map((b, j) => <div key={j} style={{ marginBottom: 6 }}>• {b}</div>)}
                  </div>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 10, color: '#0a84ff', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>Open project ↗</a>}
                </div>
              )}
            </div>
          );
        })}
      </Pad>
    </IOSAppView>
  );
};

const IOSExperience = ({ onClose }) => (
  <IOSAppView title="Experience" onClose={onClose}>
    <Pad>
      {(PD.experience || []).map((e, i) => (
        <Card key={i}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{e.role}</div>
          <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', marginTop: 2 }}>{e.company}</div>
          <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>{e.start} - {e.end}</div>
          {(e.bullets || e.points) && (
            <ul style={{ paddingLeft: 18, margin: '10px 0 0', fontSize: 13, lineHeight: 1.5, color: 'rgba(0,0,0,0.78)' }}>
              {(e.bullets || e.points).map((b, j) => <li key={j} style={{ marginBottom: 4 }}>{b}</li>)}
            </ul>
          )}
        </Card>
      ))}
    </Pad>
  </IOSAppView>
);

const IOSSkills = ({ onClose }) => (
  <IOSAppView title="Stack" onClose={onClose}>
    <Pad>
      {Object.entries(PD.skills || {}).map(([cat, vals]) => (
        <Card key={cat}>
          <Eyebrow>{cat}</Eyebrow>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(Array.isArray(vals) ? vals : [vals]).map(v => <span key={v} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.78)', fontWeight: 500 }}>{v}</span>)}
          </div>
        </Card>
      ))}
    </Pad>
  </IOSAppView>
);

const IOSWriting = ({ onClose }) => (
  <IOSAppView title="Writing" onClose={onClose}>
    <Pad>
      {(PD.writing || []).map((w, i) => (
        <a key={i} href={w.url || '#'} target={w.url ? '_blank' : undefined} rel={w.url ? 'noopener noreferrer' : undefined} style={{ display: 'block', background: 'white', borderRadius: 14, padding: 14, textDecoration: 'none', color: 'inherit', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', WebkitTapHighlightColor: 'transparent' }}>
          <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>{w.date}{w.mins ? ` · ${w.mins} min read` : ''}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f', lineHeight: 1.35 }}>{w.title}</div>
        </a>
      ))}
    </Pad>
  </IOSAppView>
);

const IOSNow = ({ onClose }) => (
  <IOSAppView title="Now" onClose={onClose} theme="dark">
    <Pad>
      <Card dark>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(168,200,150,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>What I'm doing now</div>
        <div style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 13, lineHeight: 1.7 }}>
          {(PD.now || []).map((n, i) => {
            const text = typeof n === 'string' ? n : (n.text || n.body || JSON.stringify(n));
            return (
              <div key={i} style={{ marginBottom: 6 }}>
                <span style={{ color: 'rgba(168,200,150,0.45)' }}>$ </span>{text}
              </div>
            );
          })}
        </div>
      </Card>
    </Pad>
  </IOSAppView>
);

const IOSMail = ({ onClose }) => {
  const [subject, setSubject] = mS('');
  const [body, setBody] = mS('');
  const mailto = `mailto:${(PD.links?.email?.href || '').replace('mailto:', '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <IOSAppView title="New Message" onClose={onClose}>
      <Pad>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '8px 0' }}>
            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginRight: 8 }}>To:</span>
            <span style={{ fontSize: 14, color: '#0a84ff' }}>{PD.links?.email?.label || 'jjhatch03@gmail.com'}</span>
          </div>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject"
            style={{ width: '100%', border: 0, outline: 0, fontSize: 14, padding: '10px 0', borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: 'transparent', fontFamily: 'inherit' }} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Hey Justin -" rows={8}
            style={{ width: '100%', border: 0, outline: 0, fontSize: 14, padding: '10px 0', resize: 'vertical', background: 'transparent', fontFamily: 'inherit', lineHeight: 1.5 }} />
        </Card>
        <a href={mailto} style={{
          display: 'block', textAlign: 'center', textDecoration: 'none',
          background: '#0a84ff', color: 'white', padding: '13px', borderRadius: 12,
          fontSize: 15, fontWeight: 600, WebkitTapHighlightColor: 'transparent',
          boxShadow: '0 8px 20px rgba(10,132,255,0.4)',
        }}>Open in Mail app</a>
      </Pad>
    </IOSAppView>
  );
};

const IOSResume = ({ onClose }) => (
  <IOSAppView title="Resume" onClose={onClose} theme="dark">
    <Pad>
      <Card dark>
        <div style={{ color: '#f5f5f7', fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
          The full PDF is best viewed in your browser's native PDF reader (pinch-zoom, search, save).
        </div>
        <a href={PD.links?.resume?.href} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', textAlign: 'center', textDecoration: 'none',
          background: '#0a84ff', color: 'white', padding: '13px', borderRadius: 12,
          fontSize: 15, fontWeight: 600, marginBottom: 8, WebkitTapHighlightColor: 'transparent',
        }}>Open Resume.pdf</a>
        <a href={PD.links?.resume?.href} download="Justin-Hatch-Resume.pdf" style={{
          display: 'block', textAlign: 'center', textDecoration: 'none',
          background: 'rgba(255,255,255,0.1)', color: '#f5f5f7', padding: '13px', borderRadius: 12,
          fontSize: 15, fontWeight: 500, border: '0.5px solid rgba(255,255,255,0.15)',
          WebkitTapHighlightColor: 'transparent',
        }}>Download</a>
      </Card>
    </Pad>
  </IOSAppView>
);

// ─── iPhone shell (top-level) ────────────────────────────────────────────────
const IPhoneApp = () => {
  // Boot to the home screen; chat opens only when the user taps it.
  const [activeApp, setActiveApp] = mS(null);

  const renderActive = () => {
    const close = () => setActiveApp(null);
    switch (activeApp) {
      case 'chat':       return <IOSChat onClose={close} />;
      case 'about':      return <IOSAbout onClose={close} />;
      case 'projects':   return <IOSProjects onClose={close} />;
      case 'experience': return <IOSExperience onClose={close} />;
      case 'skills':     return <IOSSkills onClose={close} />;
      case 'writing':    return <IOSWriting onClose={close} />;
      case 'now':        return <IOSNow onClose={close} />;
      case 'mail':       return <IOSMail onClose={close} />;
      case 'resume':     return <IOSResume onClose={close} />;
      default:           return null;
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden',
      background: 'linear-gradient(160deg, #06080e 0%, #0a0d16 35%, #0c1018 65%, #08090f 100%)',
    }}>
      {/* Wallpaper - subtle pale-azure glow */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-20%', width: '90%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,212,240,0.12), transparent 60%)', filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-15%', width: '90%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,212,240,0.08), transparent 60%)', filter: 'blur(100px)' }} />
      </div>
      <IOSHome onOpen={setActiveApp} />
      {activeApp && renderActive()}
    </div>
  );
};

Object.assign(window, { useMediaQuery, IPhoneApp });
