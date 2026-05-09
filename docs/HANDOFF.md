# Handoff: Justin Hatch - macOS Desktop Portfolio

## Overview
A personal portfolio styled as a fully-interactive macOS Sequoia desktop. Visitors land on a Big Sur–style wallpaper with a menubar, dock, and Finder windows containing About / Projects / Experience / Skills / Writing / Mail / Now / Resume PDF. Spotlight (⌘K) searches across all content. Two desktop widgets float on the right side: a stock ticker (defaults to SPY) and a "Generating" token-stream that types out hire-me copy.

## About the Design Files
The files in this bundle are **design references created in HTML+JSX** - interactive prototypes showing the intended look and behavior, not production code to copy directly. The HTML files use Babel-in-the-browser, inline styles, and shared `window.*` globals - that pattern doesn't belong in a real codebase.

The task is to **recreate this design in a fresh Next.js 15 (App Router) + TypeScript project** using shadcn/ui + Tailwind + Framer Motion as the foundation, pulling individual components from Magic UI / Aceternity where helpful. Treat the HTML as the visual + behavioral spec; structure the actual implementation idiomatically.

## Fidelity
**High-fidelity.** Final colors, spacing, typography, and interactions are dialed in. Recreate pixel-perfectly. The only loose pieces are a few placeholder copy strings and the simulated stock data (which can be wired to a real API later).

## Target Stack
- **Framework:** Next.js 15 (App Router), TypeScript strict
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (button, dialog, command, sheet, tooltip, scroll-area, separator)
- **Animation:** Framer Motion (window drag, dock magnification, widget animations)
- **Optional flourishes (cherry-pick, do not install whole libraries):**
  - Magic UI: `animated-beam`, `marquee` (for project carousel if used)
  - Aceternity: `card-hover-effect`, `meteors` (background sparkle, optional)
- **Icons:** lucide-react
- **PDF embed:** native `<iframe>` for /Resume.pdf in /public
- **Deploy:** Vercel

Do not install Flowbite, DaisyUI, NextUI, or Chakra - they conflict with shadcn's Tailwind-first approach.

## Architecture

```
app/
  layout.tsx              # font, metadata, theme provider
  page.tsx                # <Desktop /> root
  globals.css             # tailwind + macOS color tokens

components/
  desktop/
    desktop.tsx           # wallpaper, hero text, window stack, dock, widgets, spotlight host
    menubar.tsx           # top menubar with apple, app name, clock, status icons
    dock.tsx              # bottom dock with magnification on hover
    dock-icon.tsx
    window.tsx            # draggable, resizable macOS window chrome (Framer Motion)
    traffic-lights.tsx    # red/yellow/green close-min-zoom buttons
    spotlight.tsx         # ⌘K command palette (use shadcn <Command>)
    widget-shell.tsx      # frosted-glass card primitive

  apps/
    finder-about.tsx      # Finder window - About me + photo + CTAs
    finder-sidebar.tsx    # shared sidebar for Finder-shaped windows
    projects.tsx
    experience.tsx
    skills.tsx
    writing.tsx
    mail.tsx              # compose form with prefilled mailto
    now.tsx               # what I'm doing right now
    preview.tsx           # PDF viewer (iframe + download button)

  widgets/
    stock-widget.tsx      # SPY ticker, dropdown to switch symbols, simulated sparkline
    token-stream-widget.tsx  # "Generating" widget cycling through hire-me copy

lib/
  data.ts                 # all portfolio content (port of data.js - see below)
  apps-registry.ts        # APP_ID enum + metadata for dock/spotlight
  use-windows.ts          # zustand or React context: open/close/focus/minimize state
  use-tick.ts             # rAF clock hook for widget animations

public/
  Resume.pdf              # the actual PDF (included)
  justin.jpg              # headshot (included)
  wallpaper.jpg           # macOS Sequoia wallpaper (source from Apple/elsewhere)
```

## Design Tokens

### Colors
The design is built on macOS system colors. Add to `tailwind.config.ts`:

```ts
colors: {
  // System
  'mac-bg':       'rgb(28 28 30)',
  'mac-bg-2':     'rgb(44 44 46)',
  'mac-glass':    'rgba(28,28,30,0.55)',
  'mac-glass-light': 'rgba(255,255,255,0.55)',
  'mac-border':   'rgba(255,255,255,0.5)',

  // Accents (macOS system colors)
  'sys-blue':     '#0a84ff',
  'sys-green':    '#30d158',
  'sys-red':      '#ff453a',
  'sys-orange':   '#ff9f0a',
  'sys-yellow':   '#ffd60a',
  'sys-purple':   '#bf5af2',
  'sys-pink':     '#ff375f',

  // Traffic lights
  'tl-red':       '#ff5f57',
  'tl-yellow':    '#febc2e',
  'tl-green':     '#28c840',

  // Ink
  'ink':          '#1d1d1f',
  'ink-2':        'rgba(0,0,0,0.55)',
  'ink-3':        'rgba(0,0,0,0.45)',
}
```

### Typography
- **UI:** `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui` - load via `next/font` if you want it cross-platform; otherwise rely on Apple's system stack.
- **Mono:** `ui-monospace, "SF Mono", monospace` - used for prices, timestamps, code-ish elements.
- **Scale:** 9.5px (widget micro-labels), 11px (caption), 13px (body), 14px (UI default), 17px (window titles), 24px (widget price), 44px (About hero).

### Spacing
- Window border radius: **10px**
- Widget border radius: **18–22px**
- Card / button radius: **8px**
- Window padding: **0** (content provides own padding)
- Dock padding: **8px** with **6px** gap between icons
- Widget padding: **12–16px**

### Shadows
- Window: `0 24px 48px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.25)`
- Widget: `0 12px 36px rgba(0,0,0,0.22), inset 0 0.5px 0 rgba(255,255,255,0.6)`
- Dock: `0 12px 40px rgba(0,0,0,0.3), inset 0 0.5px 0 rgba(255,255,255,0.5)`

### Backdrop filter
Every floating surface uses `backdrop-filter: blur(40px) saturate(180%)`. Add Tailwind utility `backdrop-blur-mac` mapping to that.

## Screens

### Desktop root
- **Background:** Big Sur / Sequoia wallpaper (full-bleed `<Image fill priority>`).
- **Hero text** baked into the desktop, behind windows, dim white with `text-shadow: 0 4px 30px rgba(0,0,0,0.4)`:
  - Eyebrow: "AI / ML ENGINEER" - 14px, letter-spacing 0.4em, uppercase
  - Name: "Justin Hatch" - 92px, weight 600, letter-spacing -0.025em
  - Sub: "jjhatch03@gmail.com · Eugene, Oregon" - 14px mono
- **Menubar** (top, 28px tall): glass blur, apple logo, current app name, spacer, clock + status pills.
- **Dock** (bottom, centered, 8px from edge): glass blur 22px radius. Icons 56×56 with magnification on hover (Framer Motion `useMotionValue` + `useTransform` based on cursor x distance).
- **Windows:** opened from dock or spotlight. Draggable by titlebar. Z-order on focus. Traffic lights close/minimize/zoom.
- **Widgets:** fixed top-right, stacked.
  - StockWidget at `top: 56, right: 18`, size **440×156**.
  - TokenStreamWidget at `top: 230, right: 18`, size **300×220**.

### Finder - About
- Grid `180px minmax(0, 1fr)` with 28px gap, 32px/36px padding.
- Left: 180×180 rounded photo (radius 22). Default `/justin.jpg`.
- Right column:
  - Eyebrow: role, 11px weight 600 uppercase letter-spacing 0.08em
  - H1: name, 44px weight 600 letter-spacing -0.02em
  - Sub: location · graduating, 14px mono
  - Bio paragraphs (15px, line-height 1.55, color `rgba(0,0,0,0.78)`)
  - Honor tags (rounded pills, 11px)
  - CTA buttons: "View Projects →" (filled black), "Resume.pdf" (gray, opens Preview window), "Get in touch" (gray, mailto)

### Projects
Grid view of project cards + selectable detail pane. Source from `data.projects`.

### Experience
Timeline list - each entry: role · company, dates, bullet list of accomplishments.

### Skills
Categorized chip groups (Languages, ML/AI, Infra, Tools).

### Writing
Article list with date · read-time · title.

### Mail
Compose form with To/Subject/Body. Submit → `mailto:jjhatch03@gmail.com`.

### Now
"What I'm working on right now" - single column, plain prose, dated entries.

### Preview (PDF)
- Top toolbar (dark): "⎙ Resume.pdf" label + Download link.
- Body: `<iframe src="/Resume.pdf">` filling rest of window.

## Widgets

### StockWidget (440×156)
- Top row: `<select>` with SPY/QQQ/NVDA/AAPL/MSFT/GOOGL/TSLA, full company name, green pulse dot.
- Big price line (24px mono).
- Change line: ▲/▼, $ change, % change, 1D label. Green if up, red if down.
- Sparkline SVG at bottom (W = width-32, H = 56) with gradient fill under the line.
- Data is **simulated**: 40-point series biased toward the current price, with a `setInterval` adding small jitter. Wire to a real API (Yahoo Finance, Polygon, IEX) later.

### TokenStreamWidget (300×220)
- Header: green dot, "GENERATING" label, "claude · 124 tok/s".
- Body: monospace 13px, types one token at a time (90–200ms per token), highlighting the latest token in solid orange and prior tokens in faded orange. Blinking cursor at end.
- Cycles through 4 samples (defined in component): hire pitch, current role, what I'm looking for, contact info.

## Interactions

- **Open window:** click dock icon or spotlight result. New windows cascade-offset 30px.
- **Focus window:** click anywhere on it; bumps z-index.
- **Drag window:** mousedown on titlebar; constrain to viewport bounds.
- **Close (red):** removes from window stack.
- **Minimize (yellow):** for now, treat same as close (full minimize-to-dock animation is bonus).
- **Zoom (green):** toggle window between default size and ~92% viewport.
- **Spotlight:** `⌘K` opens shadcn `<Command>` dialog. Indexes projects, experience, writing, and apps. Selecting routes to the matching window.
- **Dock magnification:** Framer Motion. Each icon's scale = `useTransform(mouseX, [-200, 0, 200], [1, 1.6, 1])` based on distance from icon center.

## State

Use Zustand or React Context - your call. Single store:

```ts
type WindowId = 'finder' | 'projects' | 'exp' | 'skills' | 'writing' | 'mail' | 'now' | 'preview';
type WindowState = { id: WindowId; x: number; y: number; w: number; h: number; z: number; minimized: boolean };

useWindows = {
  windows: WindowState[],
  open: (id) => void,
  close: (id) => void,
  focus: (id) => void,
  setBounds: (id, partial) => void,
  spotlightOpen: boolean,
  toggleSpotlight: () => void,
}
```

## Content (data.ts)

Port `data.js` directly. The shape:

```ts
export const PORTFOLIO = {
  name: 'Justin Hatch',
  role: 'AI / ML Engineer',
  location: 'Eugene, Oregon · Remote',
  domain: 'justinhatch.com',
  graduating: 'June 2026',
  school: 'University of Oregon',
  about: [/* paragraphs */],
  honors: ["Dean's List", 'Department Honors', 'Quack Hacks II - Winner'],
  links: {
    github:    { label: 'github.com/jhatch3',          href: 'https://github.com/jhatch3' },
    linkedin:  { label: 'linkedin.com/in/justinhatch', href: 'https://www.linkedin.com/in/justinhatch/' },
    email:     { label: 'jjhatch03@gmail.com',         href: 'mailto:jjhatch03@gmail.com' },
    resume:    { label: 'Resume.pdf',                  href: '/Resume.pdf' },
  },
  projects:   [...],   // see data.js
  experience: [...],
  skills:     {...},
  writing:    [...],
  now:        [...],
} as const;
```

See `data.js` in this bundle for the full content.

## Assets included
- `Resume.pdf` - drop into `/public`
- `justin.jpg` - headshot, drop into `/public`
- `data.js` - port to `lib/data.ts`
- HTML reference files - keep around as visual spec; do not ship.

## Setup

```bash
pnpm create next-app@latest justin-hatch --ts --tailwind --app --eslint --src-dir=false --import-alias="@/*"
cd justin-hatch

# shadcn
pnpm dlx shadcn@latest init -d
pnpm dlx shadcn@latest add button command dialog scroll-area separator sheet tooltip

# motion + icons
pnpm add framer-motion lucide-react zustand

# fonts (optional - falls back to system stack)
# already handled by next/font in app/layout.tsx
```

## Deploy
- Push to GitHub
- `vercel link` → deploy
- Add custom domain `justinhatch.com` if claimed

## Open questions
- Real stock API or keep simulated? (Polygon free tier works.)
- Add light-mode (default macOS) toggle, or stay dark-glass?
- Mobile fallback: full desktop UX won't work on phones - recommend a stripped single-column view triggered below 768px.

## Files in this bundle
- `Justin Hatch.html` - main prototype, mount point + window manager
- `apps.jsx` - all window content components (FinderAbout, ProjectsApp, etc.)
- `desktop.jsx` - Desktop, Window, Menubar, Dock, Spotlight components
- `widgets.jsx` - StockWidget + TokenStreamWidget
- `data.js` - portfolio content (port to TypeScript)
- `Resume.pdf`
- `justin.jpg`
