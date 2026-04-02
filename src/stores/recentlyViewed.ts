import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Album } from '@/types'

export const useRecentlyViewedStore = defineStore('recentlyViewed', () => {
  const albums = ref<Album[]>(loadViewed())

  function addAlbum(album: Album) {
    albums.value = [album, ...albums.value.filter(a => a.id !== album.id)].slice(0, 8)
    localStorage.setItem('groove-viewed', JSON.stringify(albums.value))
  }

  function loadViewed(): Album[] {
    const data = localStorage.getItem('groove-viewed')
    return data ? JSON.parse(data) : []
  }

  return { albums, addAlbum }
})