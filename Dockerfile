# Justin Hatch portfolio — Express (Node 20) server that serves the static
# frontend from the repo root AND the API (/api/chat SSE, /api/quote, /api/health).
# Single long-lived process (SSE), so a plain container is the right shape.
#
# Build:  docker build -t justin-portfolio .
# Run:    docker run --rm -p 3000:3000 --env-file .env justin-portfolio
FROM node:20-slim

ENV NODE_ENV=production
WORKDIR /app

# Install server deps first so this layer is cached unless the lockfile changes.
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev && npm cache clean --force

# Copy the rest of the app. The server resolves its web root as
# path.resolve(here, '..', 'public') and serves ONLY that, so everything else
# copied here (Dockerfile, docker-compose files, server source) stays off the public
# surface - see .dockerignore for what never enters the image at all.
COPY . .

# Drop root privileges (the built-in `node` user ships with the base image).
USER node

# The server listens on 0.0.0.0:$PORT (default 3000).
ENV PORT=3000
EXPOSE 3000

# Container-level liveness: hit the app's own health endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Run from server/ so index.mjs's `path.resolve(here, '..')` points at the repo root.
WORKDIR /app/server
CMD ["node", "index.mjs"]
