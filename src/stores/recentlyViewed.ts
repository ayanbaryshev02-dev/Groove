import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Album } from '@/types'

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key)
    if (!data) return fallback
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed.filter((a: any) => a && a.id) as T : fallback
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

export const useRecentlyViewedStore = defineStore('recentlyViewed', () => {
  const albums = ref<Album[]>(safeGetItem('groove-viewed', []))

  function addAlbum(album: Album) {
    if (!album || !album.id) return
    albums.value = [album, ...albums.value.filter(a => a.id !== album.id)].slice(0, 8)
    try {
      localStorage.setItem('groove-viewed', JSON.stringify(albums.value))
    } catch {}
  }

  return { albums, addAlbum }
})