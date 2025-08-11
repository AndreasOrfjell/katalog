# ---------- build web ----------
FROM node:20-alpine AS webbuild
WORKDIR /web
# Installer deps basert på package.json (låsefil er valgfri)
COPY web/package.json ./
RUN npm install
# Kopier resten og bygg
COPY web/ ./
RUN npm run build

# ---------- server ----------
FROM node:20-alpine AS server
WORKDIR /app
ENV NODE_ENV=production

# Installer server-deps (prod)
COPY server/package.json ./
RUN npm install --omit=dev

# Kopier serverkode
COPY server/ ./server

# Kopier ferdig bygget frontend fra webbuild
COPY --from=webbuild /web/dist ./web/dist

# Konfig
EXPOSE 4000
ENV PORT=4000
ENV MOCK_MODE=true

# Start (Render/Docker bruker CMD her)
CMD ["node", "server/server.js"]
