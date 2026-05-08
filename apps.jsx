// apps.jsx - content for each macOS window app

const D = window.JH_DATA;

// ─── shared bits ─────────────────────────────────────────────────────────────
const Tag = ({ children, dark }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 999,
    fontSize: 11, fontWeight: 500,
    background: dark ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0.06)',
    color: dark ? 'white' : 'rgba(0,0,0,0.75)',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  }}>{children}</span>
);

const SBHead = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 8px 4px' }}>{children}</div>
);
const SBItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6,
    background: active ? 'rgba(0,122,255,0.85)' : 'transparent',
    color: active ? 'white' : '#1d1d1f',
    cursor: 'pointer', fontSize: 13, fontWeight: active ? 500 : 400,
  }}>
    <span style={{ width: 18, textAlign: 'center', opacity: 0.85 }}>{icon}</span>
    <span>{label}</span>
  </div>
);

// ─── Finder / About ──────────────────────────────────────────────────────────
const FinderAbout = ({ openApp }) => (
  <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr)', gap: 28 }}>
    <div>
      <img src="justin.jpg" alt="Justin Hatch" style={{ width: 180, height: 180, display: 'block', borderRadius: 22, objectFit: 'cover', background: 'rgba(0,0,0,0.04)' }} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{D.role}</div>
      <h1 style={{ fontSize: 44, lineHeight: 1.05, margin: 0, fontWeight: 600, letterSpacing: '-0.02em' }}>{D.name}</h1>
      <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)', marginTop: 6, fontFamily: 'ui-monospace, monospace' }}>{D.location} · graduating {D.graduating}</div>
      <div style={{ marginTop: 18, fontSize: 15, lineHeight: 1.55, color: 'rgba(0,0,0,0.78)' }}>
        {D.about.map((p, i) => <p key={i} style={{ margin: '0 0 12px' }}>{p}</p>)}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        {D.honors.map(h => <Tag key={h}>{h}</Tag>)}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
        <button onClick={() => openApp('projects')} style={{
          background: '#1d1d1f', color: 'white', border: 0, padding: '9px 16px', borderRadius: 8,
          fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
        }}>View Projects →</button>
        <button onClick={() => openApp('preview')} style={{
          background: 'rgba(0,0,0,0.06)', color: '#1d1d1f', border: 0, padding: '9px 16px', borderRadius: 8,
          fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
        }}>Resume.pdf</button>
        <a href={D.links.email.href} style={{
          background: 'rgba(0,0,0,0.06)', color: '#1d1d1f', border: 0, padding: '9px 16px', borderRadius: 8,
          fontSize: 13, fontWeight: 500, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
        }}>Get in touch</a>
      </div>
    </div>
  </div>
);

const FinderSidebar = ({ active, openApp }) => (
  <>
    <SBHead>Favorites</SBHead>
    <SBItem icon="◐" label="About"      active={active === 'finder'}   onClick={() => openApp('finder')} />
    <SBItem icon="▦" label="Projects"   active={active === 'projects'} onClick={() => openApp('projects')} />
    <SBItem icon="≡" label="Experience" active={active === 'exp'}      onClick={() => openApp('exp')} />
    <SBItem icon="◇" label="Skills"     active={active === 'skills'}   onClick={() => openApp('skills')} />
    <SBItem icon="✎" label="Writing"    active={active === 'writing'}  onClick={() => openApp('writing')} />
    <SBHead>Contact</SBHead>
    <SBItem icon="✉" label="Mail"       active={active === 'mail'}     onClick={() => openApp('mail')} />
    <SBItem icon="▷" label="Now"        active={active === 'now'}      onClick={() => openApp('now')} />
    <SBItem icon="⎙" label="Resume.pdf" active={active === 'preview'} onClick={() => openApp('preview')} />
  </>
);

// ─── Projects ────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = status === 'shipped' ? { bg: '#28c840', fg: 'white', label: 'shipped' }
            : status === 'in-progress' ? { bg: '#ff9500', fg: 'white', label: 'in progress' }
            : { bg: 'rgba(0,0,0,0.15)', fg: 'rgba(0,0,0,0.65)', label: status || 'wip' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
      background: cfg.bg, color: cfg.fg, letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.fg, opacity: 0.85 }} />
      {cfg.label}
    </span>
  );
};

const ProjectDetail = ({ project, onBack }) => {
  const bullets = project.bullets || project.points || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white', overflow: 'hidden' }}>
      <div style={{
        padding: '10px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        background: 'rgba(245,242,238,0.6)',
      }}>
        <button onClick={onBack} style={{
          background: 'rgba(0,0,0,0.06)', border: 0, borderRadius: 6,
          padding: '4px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          color: '#1d1d1f', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>‹ Projects</button>
        <span style={{ flex: 1 }} />
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" style={{
            fontSize: 12, color: '#0a84ff', textDecoration: 'none', fontWeight: 500,
            padding: '4px 10px', borderRadius: 6, background: 'rgba(10,132,255,0.08)',
          }}>Open on GitHub ↗</a>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <StatusBadge status={project.status} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.025em', margin: '4px 0 6px', lineHeight: 1.1 }}>
          {project.name}
        </h1>
        <div style={{ fontSize: 15, color: 'rgba(0,0,0,0.65)', marginBottom: 18, lineHeight: 1.45 }}>
          {project.subtitle}
        </div>
        {bullets.length > 0 ? (
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              Highlights
            </div>
            <ul style={{ margin: 0, paddingLeft: 22, fontSize: 14, lineHeight: 1.6, color: 'rgba(0,0,0,0.82)' }}>
              {bullets.map((b, i) => <li key={i} style={{ marginBottom: 8 }}>{b}</li>)}
            </ul>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', fontStyle: 'italic', marginBottom: 22 }}>
            More detail coming. Check the GitHub link for the latest.
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            Tech &amp; themes
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {project.tags.map(t => <Tag key={t}>{t}</Tag>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsApp = () => {
  const [view, setView] = useState('grid');
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [openId, setOpenId] = useState(null);

  // Tag list with frequency, sorted by count desc.
  const tagCounts = {};
  D.projects.forEach(p => p.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const allTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

  const toggleTag = (t) => setActiveTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const filtered = D.projects.filter(p => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const hay = `${p.name} ${p.subtitle} ${p.tags.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (activeTags.length > 0 && !activeTags.some(t => p.tags.includes(t))) return false;
    return true;
  });

  // Detail view takes over the whole pane.
  if (openId) {
    const p = D.projects.find(x => x.id === openId);
    if (p) return <ProjectDetail project={p} onBack={() => setOpenId(null)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top bar: search + view toggle + count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,0,0,0.05)', borderRadius: 6, padding: '5px 9px',
        }}>
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tags, descriptions..."
            style={{
              flex: 1, border: 0, outline: 0, background: 'transparent',
              fontSize: 13, fontFamily: 'inherit', color: '#1d1d1f',
            }} />
          {query && (
            <button onClick={() => setQuery('')} style={{
              background: 'transparent', border: 0, color: 'rgba(0,0,0,0.4)',
              cursor: 'pointer', padding: 0, fontSize: 14, fontFamily: 'inherit',
            }}>✕</button>
          )}
        </div>
        {['grid','list'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            background: view === v ? 'rgba(0,0,0,0.08)' : 'transparent', border: 0, borderRadius: 6,
            padding: '4px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#1d1d1f', fontFamily: 'inherit',
          }}>{v === 'grid' ? '▦' : '☰'}</button>
        ))}
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', fontFamily: 'ui-monospace, monospace', minWidth: 50, textAlign: 'right' }}>
          {filtered.length}/{D.projects.length}
        </span>
      </div>

      {/* Tag chip filter strip */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 14px',
        borderBottom: '0.5px solid rgba(0,0,0,0.06)', flexShrink: 0,
        background: 'rgba(245,242,238,0.4)',
      }}>
        {activeTags.length > 0 && (
          <button onClick={() => setActiveTags([])} style={{
            fontSize: 11, padding: '3px 9px', borderRadius: 999, border: 0,
            background: 'rgba(0,0,0,0.78)', color: 'white', cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: 500,
          }}>clear filters ✕</button>
        )}
        {allTags.map(t => {
          const active = activeTags.includes(t);
          return (
            <button key={t} onClick={() => toggleTag(t)} style={{
              fontSize: 11, padding: '3px 9px', borderRadius: 999,
              border: active ? '0.5px solid rgba(10,132,255,0.6)' : '0.5px solid rgba(0,0,0,0.12)',
              background: active ? 'rgba(10,132,255,0.15)' : 'rgba(255,255,255,0.7)',
              color: active ? '#0a66c2' : 'rgba(0,0,0,0.7)',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: active ? 600 : 500,
            }}>
              {t} <span style={{ opacity: 0.5, marginLeft: 2 }}>{tagCounts[t]}</span>
            </button>
          );
        })}
      </div>

      {/* Project grid / list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>
            No projects match.{' '}
            <button onClick={() => { setQuery(''); setActiveTags([]); }} style={{
              background: 'transparent', border: 0, color: '#0a84ff', cursor: 'pointer',
              padding: 0, fontFamily: 'inherit', fontSize: 13, textDecoration: 'underline',
            }}>Clear filters</button>
          </div>
        ) : view === 'grid' ? (
          <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 18 }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => setOpenId(p.id)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 14,
                  background: p.status === 'shipped'
                    ? 'linear-gradient(140deg, #fff 0%, #f5f5f7 60%, #e8e8ed 100%)'
                    : p.status === 'in-progress'
                    ? 'linear-gradient(140deg, #fff7e8, #ffe1ad)'
                    : 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 8px, rgba(0,0,0,0.08) 8px 9px)',
                  border: '0.5px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(0,0,0,0.55)', fontSize: 14, fontFamily: 'ui-monospace, monospace', fontWeight: 600,
                  marginBottom: 8, transition: 'transform 0.12s, box-shadow 0.12s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                >
                  {p.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.tags[0]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1.2fr 2fr 100px', gap: 12, padding: '8px 14px', fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.5)', borderBottom: '0.5px solid rgba(0,0,0,0.08)', textTransform: 'uppercase', letterSpacing: '0.06em', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <span></span><span>Name</span><span>About</span><span>Status</span>
            </div>
            {filtered.map((p, i) => (
              <div key={p.id} onClick={() => setOpenId(p.id)} style={{
                display: 'grid', gridTemplateColumns: '40px 1.2fr 2fr 100px', gap: 12, padding: '10px 14px', alignItems: 'center',
                background: i % 2 ? 'rgba(0,0,0,0.02)' : 'transparent',
                color: '#1d1d1f', cursor: 'pointer', fontSize: 13,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(10,132,255,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = i % 2 ? 'rgba(0,0,0,0.02)' : 'transparent'}
              >
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.7 }}>{String(i+1).padStart(2,'0')}</span>
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontSize: 12, opacity: 0.65 }}>{p.subtitle}</span>
                <span style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', opacity: 0.7 }}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Experience ──────────────────────────────────────────────────────────────
const ExpApp = () => (
  <div style={{ padding: '24px 32px' }}>
    <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 4px' }}>Experience</h2>
    <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', marginBottom: 20 }}>{D.school} · {D.degree}</div>
    <div style={{ position: 'relative', paddingLeft: 20 }}>
      <div style={{ position: 'absolute', left: 4, top: 6, bottom: 6, width: 1.5, background: 'rgba(0,0,0,0.12)' }} />
      {D.experience.map((e, i) => (
        <div key={i} style={{ position: 'relative', marginBottom: 26 }}>
          <div style={{ position: 'absolute', left: -20, top: 6, width: 9, height: 9, borderRadius: '50%', background: i === 0 ? '#28c840' : 'rgba(0,0,0,0.35)', border: '2px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' }} />
          <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'rgba(0,0,0,0.5)', marginBottom: 2 }}>{e.start} - {e.end} · {e.where}</div>
          <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>{e.role}</div>
          <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.7)', marginBottom: 8 }}>{e.company} <span style={{ opacity: 0.5 }}>· {e.type}</span></div>
          <ul style={{ margin: '0 0 8px', paddingLeft: 18, fontSize: 13, lineHeight: 1.55, color: 'rgba(0,0,0,0.78)' }}>
            {e.bullets.map((b, j) => <li key={j} style={{ marginBottom: 3 }}>{b}</li>)}
          </ul>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{e.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Skills ──────────────────────────────────────────────────────────────────
const SkillsApp = () => (
  <div style={{ padding: '24px 32px' }}>
    <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 4px' }}>Stack</h2>
    <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', marginBottom: 22 }}>What I reach for. Bold = daily.</div>
    {Object.entries(D.skills).map(([cat, list]) => (
      <div key={cat} style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.55)', marginBottom: 8 }}>{cat}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {list.map(s => <Tag key={s}>{s}</Tag>)}
        </div>
      </div>
    ))}
    <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: 16, marginTop: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.55)', marginBottom: 8 }}>Certifications</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'rgba(0,0,0,0.78)', lineHeight: 1.6 }}>
        {D.certs.map(c => <li key={c}>{c}</li>)}
      </ul>
    </div>
  </div>
);

// ─── Writing ─────────────────────────────────────────────────────────────────
const WritingApp = () => (
  <div style={{ padding: '24px 32px' }}>
    <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 4px' }}>Notes &amp; Reports</h2>
    <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', marginBottom: 20 }}>Technical writing on what I'm shipping.</div>
    {D.writing.map(w => (
      <div key={w.id} style={{ padding: '14px 0', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'rgba(0,0,0,0.5)', marginBottom: 4, letterSpacing: '0.04em' }}>
          {w.kind.toUpperCase()} · {w.date} · {w.mins} MIN
        </div>
        <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.25, color: '#1d1d1f', cursor: 'pointer' }}>{w.title}</div>
      </div>
    ))}
  </div>
);

// ─── Mail / Contact ──────────────────────────────────────────────────────────
const MailApp = () => {
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [body, setBody] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 18px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>New Message · To: Justin</div>
      </div>
      <div style={{ padding: '0 18px' }}>
        {[['From', from, setFrom, 'you@company.com'], ['Name', name, setName, 'Your name']].map(([l, v, set, ph]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', borderBottom: '0.5px solid rgba(0,0,0,0.06)', padding: '10px 0' }}>
            <span style={{ width: 60, fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>{l}:</span>
            <input value={v} onChange={e => set(e.target.value)} placeholder={ph} style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontSize: 14, fontFamily: 'inherit' }} />
          </div>
        ))}
      </div>
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Hey Justin -" style={{
        flex: 1, border: 0, outline: 0, background: 'transparent', resize: 'none',
        padding: '16px 18px', fontSize: 14, lineHeight: 1.6, fontFamily: 'inherit', color: '#1d1d1f',
      }} />
      <div style={{ padding: '12px 18px', borderTop: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <a href={`mailto:${D.links.email.label}?subject=Hello from ${encodeURIComponent(name || 'your site')}&body=${encodeURIComponent(body)}`}
           style={{ background: '#007aff', color: 'white', textDecoration: 'none', padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 500 }}>
          Send →
        </a>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', fontFamily: 'ui-monospace, monospace' }}>{D.links.email.label}</span>
        <span style={{ flex: 1 }} />
        {Object.entries(D.links).filter(([k]) => k !== 'email' && k !== 'resume').map(([k, v]) => (
          <a key={k} href={v.href} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', textDecoration: 'none' }}>{k}</a>
        ))}
      </div>
    </div>
  );
};

// ─── Now / Terminal ──────────────────────────────────────────────────────────
const NowApp = () => {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const all = [
      { p: '$', cmd: 'whoami' },
      { out: `${D.name.toLowerCase().replace(' ','-')} · ${D.role.toLowerCase()}` },
      { p: '$', cmd: 'cat now.txt' },
      ...D.now.map(n => ({ out: `· ${n.line}${n.detail ? '  (' + n.detail + ')' : ''}` })),
      { p: '$', cmd: 'cat available.txt' },
      { out: `available june 2026 · full-time · ai/ml engineer · ${D.location.toLowerCase()}` },
      { p: '$', cmd: '_' },
    ];
    let i = 0;
    const id = setInterval(() => {
      i++;
      setLines(all.slice(0, i));
      if (i >= all.length) clearInterval(id);
    }, 130);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      background: 'rgba(20,20,22,0.92)', color: '#e8e6e3', height: '100%', overflow: 'auto',
      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 12.5, lineHeight: 1.7, padding: '18px 22px',
    }}>
      {lines.map((l, i) => l.cmd ? (
        <div key={i}><span style={{ color: '#56b6c2' }}>{l.p}</span> <span style={{ color: '#e8e6e3' }}>{l.cmd}</span></div>
      ) : (
        <div key={i} style={{ color: '#a8c896' }}>{l.out}</div>
      ))}
    </div>
  );
};

// ─── Preview (PDF viewer) ────────────────────────────────────────────────────
const PreviewApp = () => {
  const href = D.links.resume.href;
  const btn = {
    color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
    fontSize: 11, padding: '3px 10px', borderRadius: 5,
    background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.15)',
    cursor: 'pointer', fontFamily: 'inherit',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#3a3a3c' }}>
      <div style={{
        padding: '8px 14px', background: 'rgba(0,0,0,0.4)',
        borderBottom: '0.5px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, color: 'rgba(255,255,255,0.85)',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', opacity: 0.7 }}>⎙</span>
        <span style={{ fontWeight: 500 }}>Resume.pdf</span>
        <span style={{ flex: 1 }} />
        <a href={href} target="_blank" rel="noopener noreferrer" style={btn}>Open in new tab</a>
        <a href={href} download="Justin-Hatch-Resume.pdf" style={btn}>Download</a>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', background: '#525252' }}>
        <object data={href} type="application/pdf"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <iframe src={href} style={{ width: '100%', height: '100%', border: 0 }} title="Resume" />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 13, padding: 24, textAlign: 'center',
          }}>
            Your browser can't display this PDF inline.&nbsp;
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#0a84ff' }}>Open it in a new tab</a>.
          </div>
        </object>
      </div>
    </div>
  );
};

// ─── Chat (Justin's Bot) ─────────────────────────────────────────────────────
const ChatApp = () => {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: "Hey - I'm Justin's bot. Ask me anything about his work, projects, or what he's looking for next." },
  ]);
  const [input, setInput] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const send = async () => {
    const text = input.trim();
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
      const payload = next
        .filter(m => !(m.role === 'assistant' && m.content === ''))
        .map(m => ({ role: m.role, content: m.content }));
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
      background: 'rgba(20,20,22,0.96)', color: '#f5f5f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    }}>
      <style>{`@keyframes chatDots { 0% { opacity: 0.3 } 30% { opacity: 1 } 60%, 100% { opacity: 0.3 } }`}</style>

      {/* In-window contact banner */}
      <div style={{
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
        background: '#0c1018',
        borderBottom: '0.5px solid rgba(184,212,240,0.18)', flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(160deg, #d4e3f5, #8eb4d8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#1a1f2e', fontWeight: 700, fontSize: 14, flexShrink: 0,
          boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.4)',
        }}>JH</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Justin's Bot</div>
          <div style={{ fontSize: 10.5, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158', boxShadow: '0 0 6px #30d158' }} />
            online · ask anything about Justin
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 14px 8px',
        background: 'linear-gradient(180deg, rgba(28,28,30,0.5), rgba(20,20,22,0.5))',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {messages.map((m, i) => {
          const mine = m.role === 'user';
          const isLastEmptyAssistant = !mine && !m.content && sending && i === messages.length - 1;
          return (
            <div key={i} style={{
              alignSelf: mine ? 'flex-end' : 'flex-start',
              maxWidth: '78%',
              background: mine ? '#b8d4f0' : 'rgba(40,44,54,0.95)',
              color: mine ? '#0a1020' : '#f5f5f7',
              padding: '7px 12px', borderRadius: 14,
              borderBottomRightRadius: mine ? 4 : 14,
              borderBottomLeftRadius: mine ? 14 : 4,
              fontSize: 13, lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              boxShadow: '0 1px 1px rgba(0,0,0,0.18)',
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
        {error && (
          <div style={{
            alignSelf: 'center', fontSize: 11, color: '#ff8a85',
            background: 'rgba(255,69,58,0.12)', padding: '6px 10px', borderRadius: 8,
            border: '0.5px solid rgba(255,69,58,0.3)', marginTop: 4,
          }}>{error}</div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: 10, display: 'flex', gap: 8, alignItems: 'center',
        background: 'rgba(28,28,30,0.7)',
        borderTop: '0.5px solid rgba(255,255,255,0.06)', flexShrink: 0,
      }}>
        <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
          placeholder="Ask about projects, experience, anything…" rows={1} disabled={sending}
          style={{
            flex: 1, resize: 'none', border: 0, outline: 0,
            background: 'rgba(255,255,255,0.06)', color: '#f5f5f7',
            padding: '8px 12px', borderRadius: 18, fontSize: 13, lineHeight: 1.4,
            fontFamily: 'inherit', maxHeight: 80,
          }} />
        <button onClick={send} disabled={!input.trim() || sending} aria-label="Send" style={{
          width: 36, height: 36, borderRadius: '50%', border: 0,
          background: input.trim() && !sending ? '#b8d4f0' : 'rgba(255,255,255,0.1)',
          color: input.trim() && !sending ? '#0a1020' : 'rgba(255,255,255,0.4)',
          cursor: input.trim() && !sending ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { FinderAbout, FinderSidebar, ProjectsApp, ExpApp, SkillsApp, WritingApp, MailApp, NowApp, PreviewApp, ChatApp });
