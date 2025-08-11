import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import axios from 'axios'
import pino from 'pino'

const app = express()
const logger = pino({ transport: { target: 'pino-pretty' } })

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.EASYCONNECT_BASE_URL || 'https://api.easyconnect.no'
const API_KEY = process.env.EASYCONNECT_API_KEY || ''
const MOCK_MODE = (process.env.MOCK_MODE || 'true').toLowerCase() === 'true'

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const authHeaders = () => (API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {})

// --- Mock data ---
const mockCompanies = [
  {
    orgnr: '999999999',
    name: 'Eksempel Regnskap AS',
    address: 'Storgata 1',
    postalCode: '0001',
    city: 'Oslo',
    phone: '+47 22 00 00 00',
    industries: [{ code: '69.201', name: 'Regnskapsføring' }],
    services: ['Årsoppgjør', 'Fakturering', 'Lønn'],
    website: 'https://eksempel-regnskap.no'
  },
  {
    orgnr: '888888888',
    name: 'Rørfix Norge AS',
    address: 'Industriveien 12',
    postalCode: '1473',
    city: 'Lørenskog',
    phone: '+47 67 00 00 00',
    industries: [{ code: '43.221', name: 'Rørleggerarbeid' }],
    services: ['Akutt rørservice', 'Bad', 'VVS-prosjekt'],
    website: 'https://rorfix.no'
  }
]

// --- Helpers ---
function toInt(value, fallback) { const n = parseInt(value, 10); return Number.isFinite(n) ? n : fallback }

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mock: MOCK_MODE })
})

app.get('/api/search', async (req, res) => {
  const { query = '', industry = '', service = '', region = '', page = '1', size = '20' } = req.query
  const p = toInt(page, 1)
  const s = toInt(size, 20)

  if (MOCK_MODE || !API_KEY) {
    // Simple mock filter
    const q = (query || '').toLowerCase()
    const filtered = mockCompanies.filter(c => {
      const inName = c.name.toLowerCase().includes(q)
      const inSvc = c.services.join(' ').toLowerCase().includes(q)
      const inInd = c.industries.map(i => i.name).join(' ').toLowerCase().includes(q)
      return !q || inName || inSvc || inInd
    })
    const start = (p - 1) * s
    const slice = filtered.slice(start, start + s)
    return res.json({ total: filtered.length, page: p, size: s, items: slice })
  }

  try {
    // TODO: Replace with real Easy Connect endpoints and params
    const url = `${BASE_URL}/listings/v1`
    const response = await axios.get(url, {
      headers: { ...authHeaders() },
      params: { text: query, industry, service, region, page: p, size: s }
    })
    res.json(response.data)
  } catch (err) {
    logger.error(err?.response?.data || err.message)
    res.status(502).json({ error: 'Upstream error', details: err?.response?.data || err.message })
  }
})

app.get('/api/company/:orgnr', async (req, res) => {
  const { orgnr } = req.params
  if (MOCK_MODE || !API_KEY) {
    const match = mockCompanies.find(c => c.orgnr === orgnr)
    if (!match) return res.status(404).json({ error: 'Ikke funnet' })
    return res.json(match)
  }
  try {
    const url = `${BASE_URL}/organizations/v1/${orgnr}` // adjust path
    const response = await axios.get(url, { headers: { ...authHeaders() } })
    res.json(response.data)
  } catch (err) {
    res.status(502).json({ error: 'Upstream error', details: err?.response?.data || err.message })
  }
})

// Minimal endpoints for ad tracking (stub)
app.post('/api/ads/impression', (req, res) => {
  // TODO: persist to DB/analytics
  res.json({ ok: true })
})
app.post('/api/ads/click', (req, res) => {
  res.json({ ok: true })
})


// Static hosting (if built frontend exists)
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../web/dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  // SPA fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT} (mock=${MOCK_MODE})`)
})
