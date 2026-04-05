<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import type { Album } from '@/types'
import SearchIcon from '@/assets/icons/Search.svg'
import ProfileIcon from '@/assets/icons/Profile.svg'
import BuyIcon from '@/assets/icons/Buy.svg'
import LogoIcon from '@/assets/icons/Groove.svg'

const cart = useCartStore()
const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const searchResults = ref<{ artists: { id: string; name: string }[]; albums: Album[]; genres: { id: string; name: string }[] }>({
  artists: [],
  albums: [],
  genres: []
})
const isSearchOpen = ref(false)
let debounceTimer: ReturnType<typeof setTimeout>

function onSearchInput() {
  clearTimeout(debounceTimer)
  const q = searchQuery.value.trim()

  if (!q) {
    searchResults.value = { artists: [], albums: [], genres: [] }
    isSearchOpen.value = false
    return
  }

  debounceTimer = setTimeout(async () => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    searchResults.value = await res.json()
    isSearchOpen.value = true
  }, 300)
}

function closeSearch() {
  isSearchOpen.value = false
  searchQuery.value = ''
}

function goToAlbum(id: string) {
  closeSearch()
  router.push(`/album/${id}`)
}

function goToArtist(id: string) {
  closeSearch()
  router.push(`/artist/${id}`)
}

function goToGenre(id: string) {
  closeSearch()
  router.push(`/catalog?genre=${id}`)
}

const navLinks = [
  { to: '/', label: 'HOME' },
  { to: '/catalog', label: 'CATALOG' },
  { to: '/artists', label: 'ARTISTS' },
  { to: '/catalog?sale=true', label: 'SALES' }
]

watch(route, () => {
  closeSearch()
})
</script>

<template>
  <header>
    <div class="bg-dark text-light">
      <div class="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <RouterLink to="/" class="shrink-0">
          <img :src="LogoIcon" alt="Groove" class="h-6" />
        </RouterLink>

        <div class="relative flex-1 max-w-[480px]">
          <div class="flex items-center bg-light rounded-sm overflow-hidden">
            <img :src="SearchIcon" alt="" class="w-4 h-4 ml-4 opacity-40" />
            <input
              v-model="searchQuery"
              @input="onSearchInput"
              @focus="searchQuery.trim() && (isSearchOpen = true)"
              type="text"
              placeholder="search"
              class="w-full py-2 px-3 text-dark text-base bg-transparent outline-none font-sans placeholder:text-dark/40"
            />
          </div>

          <Transition name="dropdown">
            <div
              v-if="isSearchOpen"
              class="absolute top-full left-0 right-0 mt-1 bg-light border border-dark/10 shadow-lg z-50 rounded-sm"
            >
            <div class="grid grid-cols-2 gap-6 p-6">
              <div>
                <div v-if="searchResults.artists.length">
                  <p class="text-xl font-bold text-dark mb-3">ARTISTS</p>
                  <button
                    v-for="artist in searchResults.artists"
                    :key="artist.id"
                    @click="goToArtist(artist.id)"
                    class="flex items-center gap-2 w-full text-left py-1.5 text-dark/80 hover:text-dark transition-colors cursor-pointer"
                  >
                    <img :src="SearchIcon" alt="" class="w-3.5 h-3.5 opacity-40" />
                    <span class="text-base">{{ artist.name }}</span>
                  </button>
                </div>
                

                <div v-if="searchResults.genres.length" class="mt-6">
                  <p class="text-xl font-bold text-dark mb-3">GENRE</p>
                  <button
                    v-for="genre in searchResults.genres"
                    :key="genre.id"
                    @click="goToGenre(genre.id)"
                    class="flex items-center gap-2 w-full text-left py-1.5 text-dark/80 hover:text-dark transition-colors cursor-pointer"
                  >
                    <img :src="SearchIcon" alt="" class="w-3.5 h-3.5 opacity-40" />
                    <span class="text-base">{{ genre.name }}</span>
                  </button>
                </div>
              </div>

              <div v-if="searchResults.albums.length">
                <p class="text-xl font-bold text-dark mb-3">PRODUCTS</p>
                <button
                  v-for="album in searchResults.albums"
                  :key="album.id"
                  @click="goToAlbum(album.id)"
                  class="flex gap-3 w-full text-left py-2 hover:bg-dark/5 transition-colors rounded cursor-pointer"
                >
                  <div class="w-16 h-16 bg-dark/10 rounded shrink-0 overflow-hidden">
                  <img :src="`/covers/${album.id}.webp`" :alt="album.title" class="w-full h-full object-cover" @error="($event.target as HTMLImageElement).style.display = 'none'" />
                </div>
                  <div>
                    <p class="text-base font-bold text-dark leading-tight">{{ album.title }}</p>
                    <p class="text-base text-dark/60">{{ album.artistName }}</p>
                    <p class="text-sm text-dark/80">${{ album.price.toFixed(2) }}</p>
                  </div>
                  
                </button>
              </div>
            </div>
          </div>
          </Transition>
        </div>

        <div class="flex items-center gap-5 shrink-0">
          <button class="cursor-pointer">
            <img :src="ProfileIcon" alt="Profile" class="w-6 h-6" />
          </button>
          <button @click="cart.isOpen = true" class="relative cursor-pointer">
            <img :src="BuyIcon" alt="Cart" class="w-6 h-6" />
            <span
              v-if="cart.totalItems > 0"
              class="absolute -top-2 -right-2 bg-accent text-light text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
            >
              {{ cart.totalItems }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <nav class="bg-light">
      <div class="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-center gap-8">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-base font-bold text-dark/50 hover:text-dark transition-colors tracking-wide"
          active-class="!text-dark"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </nav>
  </header>

  <div
    v-if="isSearchOpen"
    class="fixed inset-0 z-40"
    @click="closeSearch"
  ></div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>