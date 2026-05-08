# Claude Code prompt - paste into a fresh codebase

You are implementing a portfolio site styled as an interactive macOS Sequoia desktop. The full design spec is in `README.md` next to this file. The reference HTML/JSX prototypes (`Justin Hatch.html`, `apps.jsx`, `desktop.jsx`, `widgets.jsx`) and content (`data.js`) are also included.

## Your job
1. Scaffold a fresh **Next.js 15 App Router + TypeScript + Tailwind v4** project named `justin-hatch`.
2. Install **shadcn/ui** (button, command, dialog, scroll-area, separator, sheet, tooltip), **framer-motion**, **lucide-react**, **zustand**.
3. Drop `Resume.pdf` and `justin.jpg` into `/public`.
4. Port `data.js` → `lib/data.ts` (typed, `as const`).
5. Implement the architecture in README.md → "Architecture" section. Each file gets one component; no inline styles - use Tailwind classes mapped to the design tokens defined in README.md → "Design Tokens".
6. Match the HTML prototype pixel-for-pixel. Read the `.jsx` files for exact dimensions, paddings, shadows, animation curves. Don't guess.
7. Use shadcn's `<Command>` for Spotlight. Use Framer Motion for window dragging and dock magnification.
8. Window state lives in a Zustand store (`lib/use-windows.ts`).
9. Build a mobile fallback: below 768px, show a single-column scroll layout with the same content sections - no dock, no windows.
10. Lighthouse: target 95+ across the board. Use `next/image` everywhere, `next/font` for SF fallbacks, lazy-load the PDF iframe.

## Critical fidelity notes
- The whole UI is built on **glass blur** (`backdrop-filter: blur(40px) saturate(180%)`). Add a custom `backdrop-blur-mac` Tailwind utility.
- Every floating surface has an **inset top highlight**: `inset 0 0.5px 0 rgba(255,255,255,0.6)`. Bake into a `.glass` utility.
- macOS **traffic lights** are precise: 12px diameter, 8px gap, hex colors in README.
- The dock magnification curve isn't a simple scale - at hover, the focused icon hits 1.6× and the two neighbors hit ~1.3× and ~1.1×. Use a proper distance-based easing.
- **TokenStream widget**: each token highlights solid orange when first emitted, fades to faint orange after the next token arrives. Get the transition smooth (350ms ease).
- **StockWidget**: the simulated price drifts toward seed value, with a sin-wave bias plus noise. Don't replace with random walk - the existing pattern looks more "real".

## Don't
- Don't install Flowbite, DaisyUI, NextUI, Chakra, MUI - they fight Tailwind-first design.
- Don't use the global `window.*` pattern from the prototypes - use proper module imports.
- Don't add a CMS or markdown layer. Content is static, lives in `lib/data.ts`.
- Don't ship the reference HTML files.

## Definition of done
- `pnpm dev` shows the desktop on `localhost:3000`
- Every dock icon opens a working window
- ⌘K opens Spotlight, results route to the right window
- Stock + Token Stream widgets animate smoothly
- Resume.pdf opens in the embedded Preview window
- Mobile view at 375px wide is usable
- Deployed to Vercel under `justinhatch.com`
