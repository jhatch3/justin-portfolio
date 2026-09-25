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
# --include=dev because NODE_ENV=production above would otherwise skip the dev
# dependencies, and the JSX compiler is one of them. They are pruned again
# after the build, so nothing extra ships.
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --include=dev && npm cache clean --force

# Copy the rest of the app. The server resolves its web root as
# path.resolve(here, '..', 'public') and serves ONLY that, so everything else
# copied here (Dockerfile, docker-compose files, server source) stays off the public
# surface - see .dockerignore for what never enters the image at all.
COPY . .

# Compile public/js/*.jsx to plain .js, then drop the compiler. This is the
# step that keeps 639KB of @babel/standalone out of every visitor's browser.
# The .js files are generated, so they are gitignored and only ever exist
# inside the image or on a developer's machine after `npm run build`.
RUN cd server && npm run build && npm prune --omit=dev

# Where contact messages are appended (CONTACT_LOG). Created and chowned in the
# image on purpose: when Docker initialises an empty named volume it inherits the
# mountpoint's ownership from the image, so this is what keeps /data writable
# after privileges are dropped below.
RUN mkdir -p /data && chown node:node /data

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
