import type { Album, Artist } from '@/types'

const BASE = '/api'

export async function getAlbums(params?: Record<string, string>): Promise<Album[]> {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await fetch(`${BASE}/albums${query}`)
  return res.json()
}

export async function getAlbum(id: string): Promise<Album> {
  const res = await fetch(`${BASE}/albums/${id}`)
  return res.json()
}

export async function getArtists(): Promise<Artist[]> {
  const res = await fetch(`${BASE}/artists`)
  return res.json()
}

export async function getArtist(id: string): Promise<Artist> {
  const res = await fetch(`${BASE}/artists/${id}`)
  return res.json()
}

export async function getFeatured(): Promise<{
  albumOfTheMonth: Album
  outThisWeek: Album[]
  onSale: Album[]
  newArrivals: Album[]
}> {
  const res = await fetch(`${BASE}/featured`)
  return res.json()
}

export async function getGenres(): Promise<{ id: string; name: string; color: string }[]> {
  const res = await fetch(`${BASE}/genres`)
  return res.json()
}

