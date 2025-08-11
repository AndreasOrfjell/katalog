# Catalog Server

Express backend that proxies requests to Easy Connect and protects the API key.
Falls back to mock data when `MOCK_MODE=true` or no API key is set.

## Quick start
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

## Env
- `EASYCONNECT_BASE_URL` (default: `https://api.easyconnect.no`)
- `EASYCONNECT_API_KEY` (required for live mode)
- `MOCK_MODE` (`true`/`false`, default `true`)
- `PORT` (default `4000`)

## Routes
- `GET /api/health`
- `GET /api/search?query=&industry=&service=&page=1&size=20&region=`
- `GET /api/company/:orgnr`
- `POST /api/ads/impression` and `POST /api/ads/click`

Replace endpoint paths with the correct ones from Easy Connect's docs once you have access.
