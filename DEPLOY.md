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

## 6. (Optional) HTTPS with a custom domain

Free automatic TLS via Caddy — needs a domain pointed at the instance.

1. In your DNS, create an **A record** for e.g. `portfolio.example.com` → the
   instance's public IP (an Elastic IP is worth allocating so it survives stop/start).
2. Create a `Caddyfile` next to `docker-compose.yml`:

   ```
   portfolio.example.com {
       reverse_proxy web:3000
   }
   ```

3. In `docker-compose.yml`: change the `web` service's ports to
   `"127.0.0.1:3000:3000"` (so the app isn't exposed directly), then **uncomment**
   the `caddy` service and the `volumes:` block at the bottom.
4. Make sure the security group allows **443** (and keep **80** open — Caddy needs
   it for the ACME challenge and to redirect to HTTPS).
5. Apply:

   ```bash
   docker compose up -d
   ```

Caddy fetches and renews a Let's Encrypt cert automatically. The site is now at
`https://portfolio.example.com/`.

---

## Troubleshooting

| Symptom | Check |
|---|---|
| `curl /api/health` refused | `docker compose ps` — is `web` running? `docker compose logs web` |
| Container keeps restarting | Usually a missing/invalid `ANTHROPIC_API_KEY` in `.env` |
| Chatbot 500s, site loads | API key or model name in `.env`; check logs for the Anthropic error |
| Can't reach site from browser | Security group inbound 80; using the **public** IP; container mapped to `:80` |
| Cert not issued (Caddy) | DNS A record propagated? Ports 80 **and** 443 open? Domain correct in `Caddyfile`? |
