import express from 'express'
import cors from 'cors'
import albumsData from './data/albums.json'
import artistsData from './data/artists.json'
import featuredData from './data/featured.json'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://groove-vinyl.vercel.app',
    /\.vercel\.app$/
  ]
}))
app.use(express.json())

app.get('/api/albums', (req, res) => {
  let result = albumsData as any[]

  const { genre, artist, decade, sale, outThisWeek, sort, page, limit, search } = req.query

  if (genre) {
    const genres = (genre as string).split(',')
    result = result.filter(a => genres.includes(a.genre))
  }

  if (artist) {
    const artists = (artist as string).split(',')
    result = result.filter(a => artists.includes(a.artistId))
  }

  if (decade) {
    const decades = (decade as string).split(',')
    result = result.filter(a => {
      const d = `${Math.floor(a.originalReleaseYear / 10) * 10}s`
      return decades.includes(d)
    })
  }

  if (sale === 'true') {
    result = result.filter(a => a.isOnSale)
  }

  if (outThisWeek === 'true') {
    result = result.filter(a => a.tags?.includes('out-this-week'))
  }

  if (search) {
    const q = (search as string).toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.artistName.toLowerCase().includes(q)
    )
  }

  if (sort === 'price-asc') {
    result.sort((a: any, b: any) => a.price - b.price)
  } else if (sort === 'price-desc') {
    result.sort((a: any, b: any) => b.price - a.price)
  }

  const total = result.length
  const pageNum = parseInt(page as string) || 1
  const pageSize = parseInt(limit as string) || total
  const totalPages = Math.ceil(total / pageSize)
  const paginated = result.slice((pageNum - 1) * pageSize, pageNum * pageSize)

  res.json({
    data: paginated,
    page: pageNum,
    totalPages,
    total
  })
})


app.get('/api/albums/:id', (req, res) => {
  const album = (albumsData as any[]).find(a => a.id === req.params.id)
  if (!album) return res.status(404).json({ error: 'Album not found' })
  res.json(album)
})


app.get('/api/albums/:id/similar', (req, res) => {
  const album = (albumsData as any[]).find(a => a.id === req.params.id)
  if (!album) return res.status(404).json({ error: 'Album not found' })

  const similar = (albumsData as any[])
    .filter(a => a.genre === album.genre && a.id !== album.id)
    .slice(0, 8)

  res.json(similar)
})


app.get('/api/artists', (_req, res) => {
  res.json(artistsData)
})


app.get('/api/artists/:id', (req, res) => {
  const artist = (artistsData as any[]).find(a => a.id === req.params.id)
  if (!artist) return res.status(404).json({ error: 'Artist not found' })

  const albums = (albumsData as any[]).filter(a => a.artistId === req.params.id)
  res.json({ ...artist, albums })
})


app.get('/api/featured', (_req, res) => {
  const f = featuredData as any

  const albumOfTheMonth = (albumsData as any[]).find(a => a.id === f.albumOfTheMonth)
  const outThisWeek = f.outThisWeek.map((id: string) => (albumsData as any[]).find(a => a.id === id)).filter(Boolean)
  const onSale = f.onSale.map((id: string) => (albumsData as any[]).find(a => a.id === id)).filter(Boolean)
  const newArrivals = f.newArrivals.map((id: string) => (albumsData as any[]).find(a => a.id === id)).filter(Boolean)

  res.json({ albumOfTheMonth, outThisWeek, onSale, newArrivals })
})


app.get('/api/genres', (_req, res) => {
  res.json((featuredData as any).genres)
})


app.get('/api/search', (req, res) => {
  const q = ((req.query.q as string) || '').toLowerCase()
  if (!q) return res.json({ artists: [], albums: [], genres: [] })

  const artists = (artistsData as any[])
    .filter(a => a.name.toLowerCase().includes(q))
    .slice(0, 5)

  const albums = (albumsData as any[])
    .filter(a => a.title.toLowerCase().includes(q) || a.artistName.toLowerCase().includes(q))
    .slice(0, 5)

  const genres = (featuredData as any).genres
    .filter((g: any) => g.name.toLowerCase().includes(q))

  res.json({ artists, albums, genres })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})