import type { Album, Artist } from '@/types'

const BASE = import.meta.env.VITE_API_URL || '/api'

async function fetchApi<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(`API Error: ${url}`, err)
    throw err
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPages: number
  total: number
}

export interface CatalogParams {
  genre?: string[]
  artist?: string[]
  decade?: string[]
  sale?: boolean
  outThisWeek?: boolean
  sort?: 'price-asc' | 'price-desc'
  page?: number
  limit?: number
}

export async function getCatalogAlbums(params: CatalogParams = {}): Promise<PaginatedResponse<Album>> {
  const query = new URLSearchParams()

  if (params.genre?.length) query.set('genre', params.genre.join(','))
  if (params.artist?.length) query.set('artist', params.artist.join(','))
  if (params.decade?.length) query.set('decade', params.decade.join(','))
  if (params.sale) query.set('sale', 'true')
  if (params.outThisWeek) query.set('outThisWeek', 'true')
  if (params.sort) query.set('sort', params.sort)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  try {
    return await fetchApi<PaginatedResponse<Album>>(`${BASE}/albums?${query}`)
  } catch {
    return { data: [], page: 1, totalPages: 0, total: 0 }
  }
}

export async function getAlbum(id: string): Promise<Album | null> {
  try {
    return await fetchApi<Album>(`${BASE}/albums/${id}`)
  } catch {
    return null
  }
}

export async function getSimilarAlbums(id: string): Promise<Album[]> {
  try {
    return await fetchApi<Album[]>(`${BASE}/albums/${id}/similar`)
  } catch {
    return []
  }
}

export async function getArtists(): Promise<Artist[]> {
  try {
    return await fetchApi<Artist[]>(`${BASE}/artists`)
  } catch {
    return []
  }
}

export async function getArtist(id: string): Promise<(Artist & { albums: Album[] }) | null> {
  try {
    return await fetchApi<Artist & { albums: Album[] }>(`${BASE}/artists/${id}`)
  } catch {
    return null
  }
}

export async function getFeatured(): Promise<{
  albumOfTheMonth: Album
  outThisWeek: Album[]
  onSale: Album[]
  newArrivals: Album[]
} | null> {
  try {
    return await fetchApi(`${BASE}/featured`)
  } catch {
    return null
  }
}

export async function getGenres(): Promise<{ id: string; name: string; color: string }[]> {
  try {
    return await fetchApi<{ id: string; name: string; color: string }[]>(`${BASE}/genres`)
  } catch {
    return []
  }
}