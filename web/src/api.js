export async function search({ query='', industry='', service='', region='', page=1, size=20 }) {
  const params = new URLSearchParams({ query, industry, service, region, page, size })
  const res = await fetch(`/api/search?${params.toString()}`)
  if (!res.ok) throw new Error('Feil ved henting')
  return res.json()
}

export async function getCompany(orgnr) {
  const res = await fetch(`/api/company/${orgnr}`)
  if (!res.ok) throw new Error('Ikke funnet')
  return res.json()
}

// very naive ad server placeholder
export function getAds({ query='', industry='' }) {
  const items = []
  if ((query||'').toLowerCase().includes('regnskap') || industry.startsWith('69')) {
    items.push({ title: 'Tripletex for regnskapsbyrå', url: '#', copy: 'Automatiser føring og faktura.' })
  }
  if ((query||'').toLowerCase().includes('rør')) {
    items.push({ title: 'Rørdeler på nett', url: '#', copy: 'Alt til ditt VVS-prosjekt.' })
  }
  items.push({ title: 'Benchmark Businesspartner', url: '#', copy: 'IT, regnskap og markedsføring i samspill.' })
  return items
}
