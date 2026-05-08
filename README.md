# Justin Hatch — Portfolio

A personal portfolio styled as a fully-interactive macOS desktop, with a streaming
Claude chatbot, live data widgets, and a set of agent skills that let me update
the site from any terminal.

> Also ships an iOS-style home screen for phones.

## What's inside

- **macOS desktop sim** — draggable & resizable windows, dock magnification, ⌘K
  spotlight, traffic lights, frosted glass everything.
- **Justin's Bot** — streaming Claude chat (Anthropic SDK, SSE deltas, prompt
  caching, sliding 24h rate limit). Hardened against 12+ prompt-injection vectors;
  red-team suite included (`npm run grill`).
- **Live widgets** — real Yahoo Finance stock ticker (server-proxied), Coinbase
  Level-2 WebSocket order book, GitHub & LinkedIn link tiles.
- **Agent skills** — `/projects`, `/experience`, `/now` slash commands that
  CRUD the portfolio's content from any terminal. See below.
- **iOS mode** — viewports under 600×500 get a full iOS home screen with the
  same content rendered as native-feeling apps.
- **Mobile-aware Yahoo PDF preview**, configurable rate limits, prompt-cache
  hit tracking, and more.

## Stack

Static prototype today: React 18 via UMD + Babel-in-browser, plus an Express
server for the Anthropic chat proxy and Yahoo quote proxy. Designed to migrate
cleanly to Next.js 15 / App Router (see `HANDOFF.md`).

## Run locally

```bash
# 1. Configure
cp .env.example .env
# Fill in ANTHROPIC_API_KEY in .env

# 2. Install + start
cd server
npm install
npm start
```

Then open <http://localhost:3000/Justin%20Hatch.html>.

The Express server prints LAN URLs at startup so you can hit it from your phone
on the same Wi-Fi.

### Red-team the chat

```bash
cd server
npm run grill
```

Hammers `/api/chat` with 12 adversarial prompts (jailbreaks, prompt-injections,
identity probes, off-topic baits) and reports pass/fail.

## Agent skills

The `/projects`, `/experience`, and `/now` slash commands run inside Claude
Code and CRUD the portfolio's `data.js` directly:

```
/projects add Sales Agent for Modern Amenities, stack Claude/FastAPI/Tool Use
/projects update crop-share status=shipped
/projects remove project-5
/projects list

/experience add AI Engineering Intern at Modern Amenities, started Mar 2026
/experience update modern amenities add bullet "Shipped v1 to 12 enterprise customers"

/now add Reading: The Pragmatic Programmer
/now reorder reading top
```

Skills are at `~/.claude/skills/portfolio-{projects,experience,now}/`, with the
portfolio path hard-coded so they work from any cwd. From inside any other repo,
`/portfolio-projects add this repo` will scrape the current GitHub remote, build
a project entry, and commit + push the portfolio repo automatically.

## Architecture

```
/                            Static frontend (Babel-in-browser React)
  Justin Hatch.html          Mount + window manager + App switch (mobile vs desktop)
  desktop.jsx                Wallpaper, menubar, dock, draggable + resizable windows, spotlight
  apps.jsx                   Per-window content: Finder/About, Projects, Experience, etc.
  widgets.jsx                Stock ticker, GitHub & LinkedIn tiles, Coinbase order book
  mobile.jsx                 iOS home screen + per-app sheets for phones
  data.js                    Single source of truth for portfolio content

/server                      Express backend
  index.mjs                  /api/chat (SSE streaming), /api/quote (Yahoo proxy)
  system-prompt.mjs          Identity-pinned, override-resistant system prompt
  grill.mjs                  Red-team test suite

/.claude/skills              (Project-level skills if any; primary skills are user-level)
```

## License

MIT — see [`LICENSE`](LICENSE).
