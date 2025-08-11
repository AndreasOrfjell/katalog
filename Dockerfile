# ---------- build web ----------
FROM node:20-alpine AS webbuild
WORKDIR /web
COPY web/package.json web/package-lock.json* web/pnpm-lock.yaml* web/yarn.lock* ./ 2>/dev/null || true
RUN npm install
COPY web ./
RUN npm run build

# ---------- server ----------
FROM node:20-alpine AS server
WORKDIR /app
ENV NODE_ENV=production
COPY server/package.json ./
RUN npm install --omit=dev
COPY server ./server
# copy built frontend into /web/dist (the server serves it if present)
COPY --from=webbuild /web/dist ./web/dist
EXPOSE 4000
ENV PORT=4000
ENV MOCK_MODE=true
CMD ["node", "server/server.js"]
