# Deploy to AWS EC2 with Docker

This runs the portfolio (Express + Anthropic chat backend, serving the static
frontend) as a single Docker container on one EC2 instance. It's the cheapest
path — free-tier eligible — at the cost of managing the box yourself.

**What you get:** the site on `http://<instance-ip>/`, the chatbot at `/api/chat`,
health at `/api/health`. Optional HTTPS via Caddy + a domain is at the bottom.

---

## 0. Prerequisites

- An AWS account and the ability to launch EC2 + edit a security group.
- Your `ANTHROPIC_API_KEY`.
- (Optional, for HTTPS) a domain you can point at the instance.

---

## 1. Launch the instance

| Setting | Value |
|---|---|
| **AMI** | Amazon Linux 2023 |
| **Instance type** | `t4g.micro` (ARM/Graviton, free-tier eligible) or `t3.micro` (x86) |
| **Key pair** | create/select one so you can SSH in |
| **Storage** | 8–16 GB gp3 is plenty |

> **Arch note:** `t4g.*` is ARM64. This guide **builds the image on the instance**,
> so the arch always matches and there's nothing to cross-compile. (If you'd rather
> build on your laptop, build for the target arch: `docker buildx build --platform
> linux/arm64 -t justin-portfolio .` for a `t4g`, or `linux/amd64` for a `t3`.)

**Security group — inbound rules:**

| Type | Port | Source | Why |
|---|---|---|---|
| SSH | 22 | *your IP only* | admin access |
| HTTP | 80 | 0.0.0.0/0 | the site |
| HTTPS | 443 | 0.0.0.0/0 | only if you enable Caddy/TLS |

---

## 2. Install Docker

SSH in, then:

```bash
sudo dnf update -y
sudo dnf install -y docker git
sudo systemctl enable --now docker

# run docker without sudo (log out/in once after this)
sudo usermod -aG docker ec2-user

# docker compose v2 plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -sSL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m)" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

docker --version && docker compose version
```

Log out and back in so the `docker` group applies.

---

## 3. Get the code and set the secret

```bash
git clone https://github.com/jhatch3/justin-portfolio.git
cd justin-portfolio

# Create the runtime env file (gitignored — never committed, never in the image).
cp .env.example .env
nano .env        # paste your ANTHROPIC_API_KEY; keep PORT=3000
```

`.env` should look like:

```
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
PORT=3000
RATE_LIMIT_WINDOW_HOURS=24
RATE_LIMIT_MAX_MESSAGES=30
MAX_INPUT_CHARS=2000
MAX_OUTPUT_TOKENS=600
```

---

## 4. Build and run

```bash
docker compose up -d --build
```

This builds the image and starts the container with `restart: unless-stopped`,
so it comes back on reboot or crash.

**Verify:**

```bash
curl -s http://localhost/api/health        # -> {"ok":true,"model":"..."}
docker compose ps                           # STATUS should show "healthy"
docker compose logs -f web                  # follow logs (Ctrl-C to stop)
```

Then open `http://<instance-public-ip>/` in a browser. The desktop sim is at
`/desktop`.

---

## 5. Updating after a push

```bash
cd justin-portfolio
git pull
docker compose up -d --build     # rebuild + recreate with the new code
docker image prune -f            # optional: drop the old dangling image
```

**Rollback** to the previous commit if something breaks:

```bash
git checkout <previous-sha>
docker compose up -d --build
```

---

## 6. HTTPS + the `justinhatch.dev` domain (GoDaddy)

> ### ⚠️ `.dev` requires HTTPS. There is no HTTP fallback.
>
> The entire `.dev` TLD is on the **HSTS preload list baked into every major
> browser**. A browser will not load `http://justinhatch.dev` — it rewrites the
> request to `https://` before it leaves the machine, and if TLS isn't working
> it shows a full-page error with **no "proceed anyway" link**.
>
> Practical consequences:
> - Do **not** do the DNS cutover before Caddy is configured. A working
>   HTTP-only box will look completely broken on the domain.
> - You cannot smoke-test the domain over plain HTTP at any point. Test against
>   `http://<elastic-ip>` *before* cutover, and `https://justinhatch.dev` after.
> - This is a browser-side rule only. Let's Encrypt's HTTP-01 challenge on port
>   80 is made by Let's Encrypt's servers, not a browser, so it still works —
>   **keep port 80 open**.

### 6a. Give the instance a stable IP

An instance's default public IP changes on stop/start, which would silently
break the domain. Allocate an **Elastic IP** and associate it with the instance:

EC2 console → *Network & Security* → *Elastic IPs* → **Allocate Elastic IP
address** → select it → *Actions* → **Associate** → pick the instance.

Note the address; it's `ELASTIC_IP` below.

### 6b. Point GoDaddy at it

GoDaddy → **My Products** → the domain → **DNS** / *Manage DNS*.

Create (or edit) these two records:

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `ELASTIC_IP` | 600 seconds |
| `A` | `www` | `ELASTIC_IP` | 600 seconds |

Three GoDaddy-specific gotchas:

1. **Delete the parked-page records first.** A new GoDaddy domain ships with an
   `A @` record pointing at their parking IP and often a `CNAME www` →
   `@`. Edit the `A @` in place rather than adding a second one — two `A`
   records on `@` will round-robin, and half your traffic will hit the parking
   page.
2. **Turn off Domain Forwarding** if it's set (*Manage DNS* → *Forwarding*).
   It injects a redirect that will fight Caddy.
3. Use a short TTL (600s) while setting up. Raise it to 1 hour once it's stable
   — GoDaddy's default is 1 hour, which makes mistakes slow to undo.

Verify propagation before touching the server:

```bash
dig +short justinhatch.dev
dig +short www.justinhatch.dev
# both should print ELASTIC_IP
```

### 6c. Switch the stack to Caddy

The repo ships a ready `Caddyfile` (apex + a `www` → apex 301, matching the
`<link rel="canonical">` in `public/*.html`). On the instance:

1. In `docker-compose.yml`, change the `web` service's ports from `"80:3000"` to
   **`"127.0.0.1:3000:3000"`** so the app is no longer reachable directly and
   only Caddy is public.
2. **Uncomment** the `caddy` service and the `volumes:` block at the bottom.
3. Open **443** in the security group, and **leave 80 open** (ACME challenge +
   the HTTP→HTTPS redirect).
4. Apply:

   ```bash
   docker compose up -d
   ```

Caddy requests the certificate on first boot. Watch it happen:

```bash
docker compose logs -f caddy
# look for: certificate obtained successfully
```

### 6d. Verify

```bash
# 1. Certificate is real and for the right name
curl -sI https://justinhatch.dev | head -1

# 2. www redirects to the apex
curl -sI https://www.justinhatch.dev | grep -i location

# 3. Security headers survived the proxy hop
curl -sI https://justinhatch.dev | grep -iE 'strict-transport|content-security|x-content-type'

# 4. Infra is still not served
curl -s -o /dev/null -w '%{http_code}\n' https://justinhatch.dev/server/grill.mjs   # expect 404

# 5. The chatbot works end to end
curl -s -X POST https://justinhatch.dev/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Where does Justin work?"}]}' | head -5
```

Then submit `https://justinhatch.dev/sitemap.xml` in Google Search Console —
`public/robots.txt` already advertises it.

---

## Security headers and the CSP

The server sends a Content-Security-Policy via `helmet` (see the top of
`server/index.mjs`). Two directives are deliberately loose because the site has
no build step:

- `script-src` allows **`'unsafe-eval'`** — Babel Standalone compiles the JSX in
  `landing.html` / `desktop.html` / `*.jsx` in the browser at runtime.
- `script-src` / `style-src` allow **`'unsafe-inline'`** — both pages carry large
  inline `<script>` and `<style>` blocks.

Everything else is pinned to the origins actually in use. If you add a new
external script, font, image host, or `fetch`/WebSocket target, **add it to the
matching directive or the browser will silently block it.** Current allowlist:

| Directive | Allowed beyond `'self'` | Why |
|---|---|---|
| `script-src` | `unpkg.com`, `cdn.tailwindcss.com` | React + Babel UMD builds, Tailwind Play CDN |
| `style-src` | `fonts.googleapis.com` | Google Fonts stylesheet |
| `font-src` | `fonts.gstatic.com`, `data:` | Google Fonts payloads |
| `connect-src` | `ws-feed.exchange.coinbase.com` (WSS), `github-contributions-api.jogruber.de` | Order-book widget, contribution graph |
| `object-src` / `frame-src` / `frame-ancestors` | `'self'` | The resume section embeds `Resume.pdf` in an `<object>`; `'none'` here blocks the page from framing its own PDF |

To verify after a change, load both pages and confirm the console shows no
`Content Security Policy` violations.

**Caching:** HTML/JS/JSX/CSS are served `no-cache` (revalidate via ETag) because
nothing is content-hashed — a long TTL would let a returning visitor mix old code
with new `data/*.js`. Images and the PDF get `max-age=86400`; rename the file to
bust them.

---

## Troubleshooting

| Symptom | Check |
|---|---|
| `curl /api/health` refused | `docker compose ps` — is `web` running? `docker compose logs web` |
| A widget silently stops working | CSP — open devtools, look for a `Content Security Policy` violation, then add the origin to `server/index.mjs` |
| Container keeps restarting | Usually a missing/invalid `ANTHROPIC_API_KEY` in `.env` |
| Chatbot 500s, site loads | API key or model name in `.env`; check logs for the Anthropic error |
| Can't reach site from browser | Security group inbound 80; using the **public** IP; container mapped to `:80` |
| Cert not issued (Caddy) | DNS A record propagated? Ports 80 **and** 443 open? Domain correct in `Caddyfile`? |
