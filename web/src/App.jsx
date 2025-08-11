import React, { useEffect, useMemo, useState } from 'react'
import { search, getAds } from './api'

function CompanyCard({ c }) {
  return (
    <div className="company">
      <div>
        <div style={{fontWeight:600}}>{c.name}</div>
        <div className="muted">{c.address}, {c.postalCode} {c.city}</div>
        <div className="muted">{c.phone} · Org.nr {c.orgnr}</div>
        <div style={{marginTop:8}}>
          {c.services && c.services.length ? <small>Tjenester: {c.services.join(', ')}</small> : null}
        </div>
        <div className="muted">
          {c.industries && c.industries.length ? <small>Bransje: {c.industries.map(i => i.name).join(', ')}</small> : null}
        </div>
      </div>
      <div>
        {c.website ? <a className="ad" style={{background:'#111827'}} href={c.website} target="_blank">Besøk nettside</a> : null}
      </div>
    </div>
  )
}

export default function App(){
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState('')
  const [service, setService] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ total: 0, items: [] })

  const ads = useMemo(() => getAds({ query, industry }), [query, industry])

  async function doSearch(p = 1){
    setLoading(true); setError('')
    try{
      const res = await search({ query, industry, service, region, page: p })
      setData(res); setPage(p)
    }catch(e){ setError(e.message) }
    finally{ setLoading(false) }
  }

  useEffect(() => { doSearch(1) }, [])

  const totalPages = Math.max(1, Math.ceil((data.total||0)/20))

  return (
    <>
      <header>
        <div className="container">
          <strong>Katalog</strong>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Søk etter bedrifter, bransjer og tjenester</h1>
          <div className="searchbar">
            <input placeholder="Skriv f.eks. regnskapsfører, rørlegger, webdesign…"
                   value={query} onChange={e=>setQuery(e.target.value)}
                   onKeyDown={e=>{ if(e.key==='Enter') doSearch(1) }} />
            <button onClick={()=>doSearch(1)} disabled={loading}>Søk</button>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12}}>
            <select value={industry} onChange={e=>setIndustry(e.target.value)}>
              <option value="">Bransje (valgfritt)</option>
              <option value="69.201">Regnskapsføring</option>
              <option value="43.221">Rørleggerarbeid</option>
            </select>
            <input placeholder="Tjeneste (valgfritt)" value={service} onChange={e=>setService(e.target.value)} />
            <input placeholder="Region (valgfritt)" value={region} onChange={e=>setRegion(e.target.value)} />
            <button onClick={()=>{ setQuery(''); setIndustry(''); setService(''); setRegion(''); doSearch(1) }}>Nullstill</button>
          </div>
        </section>

        <section className="grid">
          <div className="card">
            {error && <div className="card" style={{background:'#fee2e2', border:'1px solid #ef4444'}}>Feil: {error}</div>}
            <div className="list">
              {(data.items||[]).map(c => <CompanyCard key={c.orgnr} c={c} />)}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:12}}>
              <button disabled={page<=1 || loading} onClick={()=>doSearch(page-1)}>Forrige</button>
              <div className="muted">Side {page} av {totalPages} – {data.total} treff</div>
              <button disabled={page>=totalPages || loading} onClick={()=>doSearch(page+1)}>Neste</button>
            </div>
          </div>

          <aside className="ads">
            <div className="card">
              <strong>Annonser</strong>
              <div style={{marginTop:12, display:'grid', gap:12}}>
                {ads.map((ad, i) => (
                  <a key={i} className="ad" href={ad.url} target="_blank" rel="noreferrer">
                    <div style={{fontWeight:700}}>{ad.title}</div>
                    <div>{ad.copy}</div>
                  </a>
                ))}
              </div>
            </div>
            <div className="card">
              <strong>Kjøp plass</strong>
              <p className="muted">Målrett mot søk eller bransje. Kontakt oss for priser.</p>
            </div>
          </aside>
        </section>
      </main>

      <footer className="container">
        <div>© {new Date().getFullYear()} Katalog</div>
      </footer>
    </>
  )
}
