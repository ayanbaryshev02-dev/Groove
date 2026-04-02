import express from 'express'
import cors from 'cors'
import albumsData from './data/albums.json'
import artistsData from './data/artists.json'
import featuredData from './data/featured.json'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// All albums (with optional filters)
app.get('/api/albums', (req, res) => {
  let result = albumsData as any[]

  const { genre, search, sale } = req.query

  if (genre) {
    result = result.filter(a => a.genre === genre)
  }

  if (search) {
    const q = (search as string).toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.artistName.toLowerCase().includes(q)
    )
  }

  if (sale === 'true') {
    result = result.filter(a => a.isOnSale)
  }

  res.json(result)
})

// Single album
app.get('/api/albums/:id', (req, res) => {
  const album = (albumsData as any[]).find(a => a.id === req.params.id)
  if (!album) return res.status(404).json({ error: 'Album not found' })
  res.json(album)
})

// All artists
app.get('/api/artists', (_req, res) => {
  res.json(artistsData)
})

// Single artist + their albums
app.get('/api/artists/:id', (req, res) => {
  const artist = (artistsData as any[]).find(a => a.id === req.params.id)
  if (!artist) return res.status(404).json({ error: 'Artist not found' })

  const albums = (albumsData as any[]).filter(a => a.artistId === req.params.id)
  res.json({ ...artist, albums })
})

// Featured data for home page
app.get('/api/featured', (_req, res) => {
  const f = featuredData as any

  const albumOfTheMonth = (albumsData as any[]).find(a => a.id === f.albumOfTheMonth)
  const outThisWeek = f.outThisWeek.map((id: string) => (albumsData as any[]).find(a => a.id === id)).filter(Boolean)
  const onSale = f.onSale.map((id: string) => (albumsData as any[]).find(a => a.id === id)).filter(Boolean)
  const newArrivals = f.newArrivals.map((id: string) => (albumsData as any[]).find(a => a.id === id)).filter(Boolean)

  res.json({ albumOfTheMonth, outThisWeek, onSale, newArrivals })
})

// Genres
app.get('/api/genres', (_req, res) => {
  res.json((featuredData as any).genres)
})

// Search (artists + albums + genres)
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