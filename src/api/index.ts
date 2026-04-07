import type { Album, Artist } from '@/types'

const BASE = '/api'

async function fetchApi<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(`API Error: ${url}`, err)
    return null
  }
}

export async function getAlbums(): Promise<Album[]> {
  return (await fetchApi<Album[]>(`${BASE}/albums`)) ?? []
}

export async function getAlbum(id: string): Promise<Album | null> {
  return fetchApi<Album>(`${BASE}/albums/${id}`)
}

export async function getArtists(): Promise<Artist[]> {
  return (await fetchApi<Artist[]>(`${BASE}/artists`)) ?? []
}

export async function getArtist(id: string): Promise<(Artist & { albums: Album[] }) | null> {
  return fetchApi<Artist & { albums: Album[] }>(`${BASE}/artists/${id}`)
}

export async function getFeatured(): Promise<{
  albumOfTheMonth: Album
  outThisWeek: Album[]
  onSale: Album[]
  newArrivals: Album[]
} | null> {
  return fetchApi(`${BASE}/featured`)
}

export async function getGenres(): Promise<{ id: string; name: string; color: string }[]> {
  return (await fetchApi<{ id: string; name: string; color: string }[]>(`${BASE}/genres`)) ?? []
}