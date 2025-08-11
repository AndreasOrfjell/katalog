# Bedriftskatalog – fullstack skjelett

Dette repoet inneholder en **server** (Express) og en **web** (Vite + React).
Serveren proxier mot Easy Connect (eller mocker data i dev), mens web er en ren,
responsiv UI med søk, filtrering og annonseplasser (forside, søk, bransje).

## Kom i gang (to terminaler)
```bash
cd server && cp .env.example .env && npm install && npm run dev
# ny terminal
cd web && npm install && npm run dev
```
Åpne http://localhost:5173

## Produksjon
- Sett `MOCK_MODE=false` og legg inn `EASYCONNECT_API_KEY`.
- Bytt til riktige Easy Connect‑endepunkter og parametere når du har dokumentasjonen.
- Legg til vedvarende lagring (Postgres/Redis) for annonsemåling og cache.

## Notater
- UI har tre annonseflater: toppbanner (forsiden), høyrekolonne (resultat), samt
  søkerelaterte/bransjeannonser som oppdateres dynamisk.
- Filtrene kan senere kobles til offisielle NACE‑koder og regionlister.
- Tilpass design/CSS etter profil.

## Kjør alt med Docker (anbefalt for rask start)
Forutsetter Docker Desktop/Docker Engine.

```bash
make up
# eller
docker compose up
```

- Backend: http://localhost:4000/api/health
- Frontend: http://localhost:5173

Stoppe:
```bash
make down
# eller
docker compose down
```

## Én‑klikk deploy (nærmest mulig «gjør alt for deg»)

### A) Render (én tjeneste: API + frontend i samme container)
1. Push dette repoet til GitHub (privat eller offentlig).
2. Gå til Render og velg **New +** → **Blueprint** og pek til `render.yaml` i repoet.
3. Sett `EASYCONNECT_API_KEY` som *Encrypted env var* (tom = mock).
4. Trykk **Deploy**. Når `MOCK_MODE=true` er satt, vil siden virke med demo‑data.

> Render bygger både frontend (Vite build) og backend (Express) i ett image. Frontend hostes av Expressen (static), og `/api/*` svarer fra samme origin.

### B) Lokal Docker (uten verktøy på maskinen)
```bash
docker build -t katalog .
docker run -p 4000:4000 -e MOCK_MODE=true katalog
# åpne http://localhost:4000
```

### C) GitHub Codespaces (nettleser, ingen installasjon)
1. Opprett et nytt repo av denne mappen og åpne i Codespaces.
2. Devcontainer spinner opp Node 20 og åpner porter 4000/5173.
3. Kjør:
   ```bash
   cd server && npm run dev
   # ny terminal
   cd web && npm run dev
   ```

Når du får Easy Connect‑nøkkel: sett `MOCK_MODE=false` og `EASYCONNECT_API_KEY` i Render/Compose/ENV.
