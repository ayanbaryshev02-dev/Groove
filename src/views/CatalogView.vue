<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { getAlbums, getArtists, getGenres } from '@/api'
import type { Album, Artist } from '@/types'
import AlbumCard from '@/components/shared/AlbumCard.vue'

const route = useRoute()
const router = useRouter()

const allAlbums = ref<Album[]>([])
const artists = ref<Artist[]>([])
const genres = ref<{ id: string; name: string; color: string }[]>([])
const isLoading = ref(true)
const isTransitioning = ref(false)

const activeDropdown = ref<string | null>(null)

const selectedArtists = ref<string[]>([])
const selectedGenres = ref<string[]>([])
const selectedDecades = ref<string[]>([])
const priceSort = ref<string>('')
const showOnSale = ref(false)
const showOutThisWeek = ref(false)

const availableDecades = computed(() => {
  const decades = new Set<string>()
  allAlbums.value.forEach(a => {
    const decade = Math.floor(a.originalReleaseYear / 10) * 10
    decades.add(`${decade}s`)
  })
  return Array.from(decades).sort()
})

const filteredAlbums = computed(() => {
  let result = [...allAlbums.value]

  if (selectedArtists.value.length) {
    result = result.filter(a => selectedArtists.value.includes(a.artistId))
  }

  if (selectedGenres.value.length) {
    result = result.filter(a => selectedGenres.value.includes(a.genre))
  }

  if (selectedDecades.value.length) {
    result = result.filter(a => {
      const decade = `${Math.floor(a.originalReleaseYear / 10) * 10}s`
      return selectedDecades.value.includes(decade)
    })
  }

  if (showOnSale.value) {
    result = result.filter(a => a.isOnSale)
  }

  if (showOutThisWeek.value) {
    result = result.filter(a => a.tags?.includes('out-this-week'))
  }

  if (priceSort.value === 'low') {
    result.sort((a, b) => a.price - b.price)
  } else if (priceSort.value === 'high') {
    result.sort((a, b) => b.price - a.price)
  }

  return result
})

const hasActiveFilters = computed(() => {
  return selectedArtists.value.length > 0 ||
    selectedGenres.value.length > 0 ||
    selectedDecades.value.length > 0 ||
    priceSort.value !== '' ||
    showOnSale.value ||
    showOutThisWeek.value
})

function toggleDropdown(name: string) {
  activeDropdown.value = activeDropdown.value === name ? null : name
}

function toggleArtist(id: string) {
  animateFilter()
  const idx = selectedArtists.value.indexOf(id)
  if (idx >= 0) selectedArtists.value.splice(idx, 1)
  else selectedArtists.value.push(id)
}

function toggleGenre(id: string) {
  animateFilter()
  const idx = selectedGenres.value.indexOf(id)
  if (idx >= 0) selectedGenres.value.splice(idx, 1)
  else selectedGenres.value.push(id)
}

function toggleDecade(decade: string) {
  animateFilter()
  const idx = selectedDecades.value.indexOf(decade)
  if (idx >= 0) selectedDecades.value.splice(idx, 1)
  else selectedDecades.value.push(decade)
}

function setPriceSort(sort: string) {
  animateFilter()
  priceSort.value = priceSort.value === sort ? '' : sort
}

function toggleOnSale() {
  animateFilter()
  showOnSale.value = !showOnSale.value
}

function toggleOutThisWeek() {
  animateFilter()
  showOutThisWeek.value = !showOutThisWeek.value
}

function clearFilters() {
  animateFilter()
  selectedArtists.value = []
  selectedGenres.value = []
  selectedDecades.value = []
  priceSort.value = ''
  showOnSale.value = false
  showOutThisWeek.value = false
  router.replace({ path: '/catalog' })
}

function animateFilter() {
  isTransitioning.value = true
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

function applyRouteFilters() {
  const q = route.query
  if (q.genre) {
    selectedGenres.value = [q.genre as string]
  }
  if (q.sale === 'true') {
    showOnSale.value = true
  }
  if (q.outThisWeek === 'true') {
    showOutThisWeek.value = true
  }
}

onMounted(async () => {
  const [albumsData, artistsData, genresData] = await Promise.all([
    getAlbums(),
    getArtists(),
    getGenres()
  ])
  allAlbums.value = albumsData
  artists.value = artistsData
  genres.value = genresData
  applyRouteFilters()
  isLoading.value = false
})

watch(() => route.query, () => {
  selectedArtists.value = []
  selectedGenres.value = []
  selectedDecades.value = []
  priceSort.value = ''
  showOnSale.value = false
  showOutThisWeek.value = false
  applyRouteFilters()
})
</script>

<template>
  <div v-if="!isLoading">
    <div class="max-w-[1200px] mx-auto px-6 pt-4 pb-2">
      <div class="flex items-center gap-2 text-[14px] text-dark/50">
        <RouterLink to="/" class="hover:text-dark transition-colors">Home</RouterLink>
        <span>›</span>
        <span class="text-dark">Catalog</span>
      </div>
    </div>

    <div class="bg-dark">
      <div class="max-w-[1200px] mx-auto px-6 py-6">
        <div class="flex gap-4">
          <div class="relative flex-1">
            <button
              @click="toggleDropdown('artists')"
              class="w-full py-3 px-4 border border-light/30 rounded-sm text-light text-[14px] flex items-center justify-between cursor-pointer hover:border-light/60 transition-colors"
            >
              <span>ARTISTS</span>
              <span class="text-[10px]" :class="activeDropdown === 'artists' ? 'rotate-180' : ''">▼</span>
            </button>
            <div v-if="activeDropdown === 'artists'" class="absolute top-full left-0 right-0 mt-1 bg-dark border border-light/20 rounded-sm z-50 max-h-[240px] overflow-y-auto">
              <label
                v-for="artist in [...artists].sort((a, b) => a.name.localeCompare(b.name))"
                :key="artist.id"
                class="flex items-center gap-3 px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :checked="selectedArtists.includes(artist.id)"
                  @change="toggleArtist(artist.id)"
                  class="w-4 h-4 accent-accent"
                />
                {{ artist.name }}
              </label>
            </div>
          </div>

          <div class="relative flex-1">
            <button
              @click="toggleDropdown('genre')"
              class="w-full py-3 px-4 border border-light/30 rounded-sm text-light text-[14px] flex items-center justify-between cursor-pointer hover:border-light/60 transition-colors"
            >
              <span>GENRE</span>
              <span class="text-[10px]" :class="activeDropdown === 'genre' ? 'rotate-180' : ''">▼</span>
            </button>
            <div v-if="activeDropdown === 'genre'" class="absolute top-full left-0 right-0 mt-1 bg-dark border border-light/20 rounded-sm z-50 max-h-[240px] overflow-y-auto">
              <label
                v-for="genre in genres"
                :key="genre.id"
                class="flex items-center gap-3 px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :checked="selectedGenres.includes(genre.id)"
                  @change="toggleGenre(genre.id)"
                  class="w-4 h-4 accent-accent"
                />
                {{ genre.name.toUpperCase() }}
              </label>
            </div>
          </div>

          <div class="relative flex-1">
            <button
              @click="toggleDropdown('years')"
              class="w-full py-3 px-4 border border-light/30 rounded-sm text-light text-[14px] flex items-center justify-between cursor-pointer hover:border-light/60 transition-colors"
            >
              <span>YEARS</span>
              <span class="text-[10px]" :class="activeDropdown === 'years' ? 'rotate-180' : ''">▼</span>
            </button>
            <div v-if="activeDropdown === 'years'" class="absolute top-full left-0 right-0 mt-1 bg-dark border border-light/20 rounded-sm z-50">
              <label
                v-for="decade in availableDecades"
                :key="decade"
                class="flex items-center gap-3 px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :checked="selectedDecades.includes(decade)"
                  @change="toggleDecade(decade)"
                  class="w-4 h-4 accent-accent"
                />
                {{ decade }}
              </label>
              <div class="border-t border-light/10 mt-1 pt-1">
                <label class="flex items-center gap-3 px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="showOutThisWeek"
                    @change="toggleOutThisWeek"
                    class="w-4 h-4 accent-accent"
                  />
                  OUT THIS WEEK
                </label>
              </div>
            </div>
          </div>

          <div class="relative flex-1">
            <button
              @click="toggleDropdown('price')"
              class="w-full py-3 px-4 border border-light/30 rounded-sm text-light text-[14px] flex items-center justify-between cursor-pointer hover:border-light/60 transition-colors"
            >
              <span>PRICE</span>
              <span class="text-[10px]" :class="activeDropdown === 'price' ? 'rotate-180' : ''">▼</span>
            </button>
            <div v-if="activeDropdown === 'price'" class="absolute top-full left-0 right-0 mt-1 bg-dark border border-light/20 rounded-sm z-50">
              <button
                @click="setPriceSort('low')"
                class="w-full text-left px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer flex items-center gap-3"
              >
                <span class="w-4 h-4 border border-light/40 rounded-sm flex items-center justify-center text-[10px]">{{ priceSort === 'low' ? '✓' : '' }}</span>
                LOW TO HIGH
              </button>
              <button
                @click="setPriceSort('high')"
                class="w-full text-left px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer flex items-center gap-3"
              >
                <span class="w-4 h-4 border border-light/40 rounded-sm flex items-center justify-center text-[10px]">{{ priceSort === 'high' ? '✓' : '' }}</span>
                HIGH TO LOW
              </button>
              <div class="border-t border-light/10 mt-1 pt-1">
                <button
                  @click="toggleOnSale"
                  class="w-full text-left px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer flex items-center gap-3"
                >
                  <span class="w-4 h-4 border border-light/40 rounded-sm flex items-center justify-center text-[10px]">{{ showOnSale ? '✓' : '' }}</span>
                  ON SALE
                </button>
              </div>
            </div>
          </div>

          <button
            @click="clearFilters"
            class="px-8 py-3 text-dark text-[14px] font-bold cursor-pointer hover:bg-light/80 transition-colors"
            :class="hasActiveFilters ? 'bg-light' : 'bg-light/60'"
          >
            CLEAR FILTERS
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-6 py-12">
      <div
        class="grid grid-cols-4 gap-x-8 gap-y-12 transition-opacity duration-300"
        :class="isTransitioning ? 'opacity-0' : 'opacity-100'"
      >
        <AlbumCard v-for="album in filteredAlbums" :key="album.id" :album="album" />
      </div>
      <div v-if="filteredAlbums.length === 0" class="text-center py-20">
        <p class="text-[24px] text-dark/40">No albums found with these filters</p>
        <button @click="clearFilters" class="mt-4 text-accent text-[16px] font-bold cursor-pointer hover:opacity-70">
          Clear all filters
        </button>
      </div>
    </div>

    <div
      v-if="activeDropdown"
      class="fixed inset-0 z-40"
      @click="activeDropdown = null"
    ></div>
  </div>
</template>