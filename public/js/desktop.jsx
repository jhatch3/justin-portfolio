// desktop.jsx - macOS desktop chrome: wallpaper, menubar, dock, window manager

const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

// ─── Wallpaper ───────────────────────────────────────────────────────────────
// Dark mode with pale accent: deep charcoal-navy gradient, restrained pale-azure glow.
const Wallpaper = () => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
    background: 'linear-gradient(160deg, #06080e 0%, #0a0d16 35%, #0c1018 65%, #08090f 100%)',
  }}>
    <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '70%', height: '70%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(184,212,240,0.10), transparent 60%)', filter: 'blur(100px)' }} />
    <div style={{ position: 'absolute', top: '30%', right: '-15%', width: '60%', height: '70%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(184,212,240,0.08), transparent 60%)', filter: 'blur(120px)' }} />
    <div style={{ position: 'absolute', bottom: '-25%', left: '25%', width: '60%', height: '60%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(184,212,240,0.06), transparent 60%)', filter: 'blur(100px)' }} />
  </div>
);

// ─── Menubar ─────────────────────────────────────────────────────────────────
const AppleLogo = ({ size = 14 }) => (
  <svg width={size} height={size * 1.18} viewBox="0 0 170 200" fill="currentColor" aria-hidden="true">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375a25.222 25.222 0 0 1-.188-3.07c0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71.12 1.083.17 2.166.17 3.24z"/>
  </svg>
);

const Menubar = ({ active, onSpotlight, time, onAbout }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 26,
    background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    color: 'white', display: 'flex', alignItems: 'center',
    padding: '0 14px', fontSize: 13, fontWeight: 400,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    boxShadow: '0 1px 0 rgba(255,255,255,0.08), 0 1px 12px rgba(0,0,0,0.08)',
    textShadow: '0 1px 1px rgba(0,0,0,0.15)',
  }}>
    <button onClick={onAbout} aria-label="About this Mac" style={{ background: 'transparent', border: 0, padding: '0 8px', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', height: 26 }}>
      <AppleLogo />
    </button>
    <span style={{ fontWeight: 600, padding: '0 10px' }}>{active || 'Finder'}</span>
    {['File','Edit','View','Go','Window','Help'].map(m => (
      <span key={m} style={{ padding: '0 9px', opacity: 0.95, cursor: 'default' }}>{m}</span>
    ))}
    <span style={{ flex: 1 }} />
    <span style={{ padding: '0 10px', opacity: 0.95 }}>⏻</span>
    <span style={{ padding: '0 10px', opacity: 0.95 }}>🔋</span>
    <button onClick={onSpotlight} aria-label="Spotlight" style={{ background: 'transparent', border: 0, padding: '0 8px', color: 'inherit', cursor: 'pointer', fontSize: 14, height: 26 }}>⌕</button>
    <span style={{ padding: '0 10px', opacity: 0.95 }}>⊞</span>
    <span style={{ padding: '0 10px', opacity: 0.95, fontVariantNumeric: 'tabular-nums' }}>{time}</span>
  </div>
);

// ─── Window ──────────────────────────────────────────────────────────────────
const TrafficLights = ({ onClose, onMinimize, onZoom, hovered }) => {
  const dot = (color, glyph, handler, label) => (
    <button onClick={(e) => { e.stopPropagation(); handler && handler(); }} aria-label={label} style={{
      width: 12, height: 12, borderRadius: '50%', background: color, border: '0.5px solid rgba(0,0,0,0.15)',
      padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 8, color: 'rgba(0,0,0,0.55)', lineHeight: 1, fontFamily: 'monospace',
    }}>
      <span style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.1s' }}>{glyph}</span>
    </button>
  );
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {dot('#ff5f57', '×', onClose, 'Close')}
      {dot('#febc2e', '−', onMinimize, 'Minimize')}
      {dot('#28c840', '+', onZoom, 'Zoom')}
    </div>
  );
};

const MIN_W = 320, MIN_H = 220;

const Window = ({ id, title, x, y, w, h, z, onFocus, onClose, onMinimize, onMove, onResize, onZoom, zoomed, children, sidebar, accent = 'rgba(255,255,255,0.78)' }) => {
  const [tlHover, setTlHover] = useState(false);
  const ref = useRef(null);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('button')) return;
    onFocus();
    const startX = e.clientX, startY = e.clientY;
    const ox = x, oy = y;
    const move = (ev) => onMove(id, ox + (ev.clientX - startX), Math.max(28, oy + (ev.clientY - startY)));
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  };

  // Generic resize handler. `dirs` is { dx, dy, dw, dh } scalars saying how
  // each pointer-axis maps onto x/y/w/h deltas (e.g. left edge: dx=1, dw=-1).
  const onResizeStart = (dirs) => (e) => {
    if (e.button !== 0 || zoomed || !onResize) return;
    e.stopPropagation();
    onFocus();
    const startX = e.clientX, startY = e.clientY;
    const ox = x, oy = y, ow = w, oh = h;
    const move = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let nw = ow + dirs.dw * dx;
      let nh = oh + dirs.dh * dy;
      let nx = ox + dirs.dx * dx;
      let ny = oy + dirs.dy * dy;
      // Clamp to mins; if min hit, lock the moving edge so the opposite edge stays put.
      if (nw < MIN_W) {
        if (dirs.dx) nx = ox + (ow - MIN_W);
        nw = MIN_W;
      }
      if (nh < MIN_H) {
        if (dirs.dy) ny = oy + (oh - MIN_H);
        nh = MIN_H;
      }
      ny = Math.max(28, ny);
      onResize(id, { x: nx, y: ny, w: nw, h: nh });
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const styleW = zoomed ? { left: 0, top: 26, width: '100vw', height: 'calc(100vh - 90px)' }
                        : { left: x, top: y, width: w, height: h };

  return (
    <div ref={ref} onMouseDown={onFocus} style={{
      position: 'fixed', zIndex: 100 + z,
      ...styleW,
      background: accent,
      backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.5)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.15), inset 0 0.5px 0 rgba(255,255,255,0.6)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      transition: zoomed ? 'all 0.22s cubic-bezier(.2,.8,.3,1)' : 'box-shadow 0.15s',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      color: '#1d1d1f',
    }}>
      <div onMouseDown={onMouseDown} onDoubleClick={onZoom}
           onMouseEnter={() => setTlHover(true)} onMouseLeave={() => setTlHover(false)}
           style={{
             height: 36, display: 'flex', alignItems: 'center', padding: '0 14px',
             cursor: 'grab', userSelect: 'none', flexShrink: 0,
             borderBottom: '0.5px solid rgba(0,0,0,0.08)',
           }}>
        <TrafficLights hovered={tlHover} onClose={onClose} onMinimize={onMinimize} onZoom={onZoom} />
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.78)' }}>{title}</div>
        <div style={{ width: 60 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {sidebar && <div style={{ width: 180, background: 'rgba(245,242,238,0.55)', borderRight: '0.5px solid rgba(0,0,0,0.06)', padding: '12px 8px', overflowY: 'auto', fontSize: 13 }}>{sidebar}</div>}
        <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>{children}</div>
      </div>
      {!zoomed && onResize && (
        <>
          {/* Edges */}
          <div onMouseDown={onResizeStart({ dx: 0, dy: 1, dw: 0, dh: -1 })}
               style={{ position: 'absolute', top: 0, left: 8, right: 8, height: 5, cursor: 'ns-resize', zIndex: 5 }} />
          <div onMouseDown={onResizeStart({ dx: 0, dy: 0, dw: 0, dh: 1 })}
               style={{ position: 'absolute', bottom: 0, left: 8, right: 8, height: 5, cursor: 'ns-resize', zIndex: 5 }} />
          <div onMouseDown={onResizeStart({ dx: 1, dy: 0, dw: -1, dh: 0 })}
               style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 5, cursor: 'ew-resize', zIndex: 5 }} />
          <div onMouseDown={onResizeStart({ dx: 0, dy: 0, dw: 1, dh: 0 })}
               style={{ position: 'absolute', right: 0, top: 8, bottom: 8, width: 5, cursor: 'ew-resize', zIndex: 5 }} />
          {/* Corners (12px hit area) */}
          <div onMouseDown={onResizeStart({ dx: 1, dy: 1, dw: -1, dh: -1 })}
               style={{ position: 'absolute', top: 0, left: 0, width: 12, height: 12, cursor: 'nwse-resize', zIndex: 6 }} />
          <div onMouseDown={onResizeStart({ dx: 0, dy: 1, dw: 1, dh: -1 })}
               style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, cursor: 'nesw-resize', zIndex: 6 }} />
          <div onMouseDown={onResizeStart({ dx: 1, dy: 0, dw: -1, dh: 1 })}
               style={{ position: 'absolute', bottom: 0, left: 0, width: 12, height: 12, cursor: 'nesw-resize', zIndex: 6 }} />
          <div onMouseDown={onResizeStart({ dx: 0, dy: 0, dw: 1, dh: 1 })}
               style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, cursor: 'nwse-resize', zIndex: 6 }} />
        </>
      )}
    </div>
  );
};

// ─── Dock ────────────────────────────────────────────────────────────────────
const DockIcon = ({ app, running, onClick, idx }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
      {hover && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 38px)', left: '50%', transform: 'translateX(-50%)',
          whiteSpace: 'nowrap', zIndex: 1000,
          background: 'rgba(50,50,50,0.92)', color: 'white', padding: '5px 11px',
          borderRadius: 6, fontSize: 12, fontWeight: 500, pointerEvents: 'none',
          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>{app.title}</div>
      )}
      <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
        transform: hover ? 'translateY(-10px) scale(1.35)' : 'scale(1)',
        transformOrigin: 'bottom center',
        transition: 'transform 0.18s cubic-bezier(.2,.8,.3,1)',
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: 12,
          background: app.iconBg || 'linear-gradient(160deg, #fff, #ddd)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: app.iconColor || '#1d1d1f', fontSize: app.iconSize || 24, fontWeight: app.iconWeight || 600,
          boxShadow: '0 4px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5)',
          border: '0.5px solid rgba(0,0,0,0.1)',
          fontFamily: app.iconFont || '-apple-system, BlinkMacSystemFont, sans-serif',
          letterSpacing: app.iconSize && app.iconSize < 24 ? '-0.02em' : 0,
        }}>{app.icon}</div>
      </button>
      <div style={{ width: 4, height: 4, marginTop: 4, borderRadius: '50%',
        background: running ? 'rgba(0,0,0,0.55)' : 'transparent' }} />
    </div>
  );
};

const Dock = ({ apps, openIds, onOpen }) => (
  <div style={{
    position: 'fixed', bottom: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 999,
    display: 'flex', alignItems: 'flex-end', gap: 6, padding: '6px 10px',
    background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    borderRadius: 18, border: '0.5px solid rgba(255,255,255,0.4)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 0.5px 0 rgba(255,255,255,0.5)',
  }}>
    {apps.map((app, i) => (
      <DockIcon key={app.id} app={app} idx={i} running={openIds.includes(app.id)} onClick={() => onOpen(app.id)} />
    ))}
  </div>
);

// ─── Spotlight ───────────────────────────────────────────────────────────────
const Spotlight = ({ open, onClose, onSelect, items }) => {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { if (open) { setQ(''); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);
  if (!open) return null;
  const ql = q.trim().toLowerCase();
  const filtered = ql
    ? items.filter(it => (it.title + ' ' + it.kind + ' ' + (it.meta || '')).toLowerCase().includes(ql))
    : items.slice(0, 8);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '18vh',
      background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 640, maxWidth: '90vw',
        background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.6)',
        boxShadow: '0 30px 90px rgba(0,0,0,0.35)', overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
          <span style={{ fontSize: 22, color: 'rgba(0,0,0,0.5)' }}>⌕</span>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
                 placeholder="Spotlight Search"
                 onKeyDown={e => {
                   if (e.key === 'Escape') onClose();
                   if (e.key === 'Enter' && filtered[0]) { onSelect(filtered[0]); onClose(); }
                 }}
                 style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontSize: 22, color: '#1d1d1f' }} />
        </div>
        {filtered.length > 0 && (
          <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', maxHeight: 360, overflowY: 'auto' }}>
            {filtered.map((it, i) => (
              <div key={i} onClick={() => { onSelect(it); onClose(); }}
                   style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 14, padding: '10px 18px',
                     alignItems: 'center', cursor: 'pointer',
                     background: i === 0 ? 'rgba(0,122,255,0.85)' : 'transparent',
                     color: i === 0 ? 'white' : '#1d1d1f' }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.75 }}>{it.kind}</span>
                <span style={{ fontSize: 14 }}>{it.title}</span>
                <span style={{ fontSize: 11, opacity: 0.7, fontFamily: 'ui-monospace, monospace' }}>{it.meta || ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { Wallpaper, Menubar, Window, Dock, DockIcon, Spotlight });
