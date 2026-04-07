<script lang="ts">
export default { name: 'CatalogView' }
</script>
<script setup lang="ts">
import { ref, computed, onMounted, watch, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCatalogAlbums, getArtists, getGenres } from '@/api'
import type { Album, Artist } from '@/types'
import AlbumCard from '@/components/shared/AlbumCard.vue'
import CatalogFilters from '@/components/catalog/CatalogFilters.vue'

const route = useRoute()
const router = useRouter()

const albums = ref<Album[]>([])
const allDecades = ref<string[]>([])
const artists = ref<Artist[]>([])
const genres = ref<{ id: string; name: string; color: string }[]>([])
const isLoading = ref(true)
const isTransitioning = ref(false)

const selectedArtists = ref<string[]>([])
const selectedGenres = ref<string[]>([])
const selectedDecades = ref<string[]>([])
const priceSort = ref('')
const showOnSale = ref(false)
const showOutThisWeek = ref(false)

const hasActiveFilters = computed(() =>
  selectedArtists.value.length > 0 ||
  selectedGenres.value.length > 0 ||
  selectedDecades.value.length > 0 ||
  priceSort.value !== '' ||
  showOnSale.value ||
  showOutThisWeek.value
)

async function fetchAlbums() {
  isTransitioning.value = true
  const sortMap: Record<string, 'price-asc' | 'price-desc'> = { low: 'price-asc', high: 'price-desc' }
  const result = await getCatalogAlbums({
    genre: selectedGenres.value.length ? selectedGenres.value : undefined,
    artist: selectedArtists.value.length ? selectedArtists.value : undefined,
    decade: selectedDecades.value.length ? selectedDecades.value : undefined,
    sale: showOnSale.value || undefined,
    outThisWeek: showOutThisWeek.value || undefined,
    sort: sortMap[priceSort.value]
  })
  albums.value = result.data
  setTimeout(() => { isTransitioning.value = false }, 100)
}

function toggle(arr: string[], id: string) {
  const idx = arr.indexOf(id)
  idx >= 0 ? arr.splice(idx, 1) : arr.push(id)
  fetchAlbums()
}

function clearFilters() {
  selectedArtists.value = []
  selectedGenres.value = []
  selectedDecades.value = []
  priceSort.value = ''
  showOnSale.value = false
  showOutThisWeek.value = false
  router.replace({ path: '/catalog' })
  fetchAlbums()
}

function applyRouteFilters() {
  const q = route.query
  if (q.genre) selectedGenres.value = [q.genre as string]
  if (q.sale === 'true') showOnSale.value = true
  if (q.outThisWeek === 'true') showOutThisWeek.value = true
}

onMounted(async () => {
  const [allResult, artistsData, genresData] = await Promise.all([
    getCatalogAlbums(),
    getArtists(),
    getGenres()
  ])
  artists.value = artistsData
  genres.value = genresData

  const decades = new Set<string>()
  allResult.data.forEach(a => {
    const decade = Math.floor(a.originalReleaseYear / 10) * 10
    decades.add(`${decade}s`)
  })
  allDecades.value = Array.from(decades).sort()

  applyRouteFilters()
  await fetchAlbums()
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
  fetchAlbums()
})

let savedScroll = 0
onDeactivated(() => { savedScroll = window.scrollY })
onActivated(() => { window.scrollTo({ top: savedScroll, behavior: 'instant' }) })
</script>

<template>
  <div v-if="!isLoading" class="animate-page-in">
    <div class="max-w-[var(--container)] mx-auto px-6 pt-4 pb-2">
      <div class="flex items-center gap-2 text-[14px] text-dark/50">
        <button @click="router.back()" class="hover:text-dark transition-colors cursor-pointer">Home</button>
        <span>›</span>
        <span class="text-dark">Catalog</span>
      </div>
    </div>

    <CatalogFilters
      :artists="artists"
      :genres="genres"
      :available-decades="allDecades"
      :selected-artists="selectedArtists"
      :selected-genres="selectedGenres"
      :selected-decades="selectedDecades"
      :price-sort="priceSort"
      :show-on-sale="showOnSale"
      :show-out-this-week="showOutThisWeek"
      :has-active-filters="hasActiveFilters"
      @toggle-artist="toggle(selectedArtists, $event)"
      @toggle-genre="toggle(selectedGenres, $event)"
      @toggle-decade="toggle(selectedDecades, $event)"
      @set-price-sort="(s) => { priceSort = priceSort === s ? '' : s; fetchAlbums() }"
      @toggle-on-sale="showOnSale = !showOnSale; fetchAlbums()"
      @toggle-out-this-week="showOutThisWeek = !showOutThisWeek; fetchAlbums()"
      @clear-filters="clearFilters"
    />

    <div class="max-w-[var(--container)] mx-auto px-6 py-12">
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12 transition-opacity duration-300"
        :class="isTransitioning ? 'opacity-0' : 'opacity-100'"
      >
        <AlbumCard v-for="album in albums" :key="album.id" :album="album" />
      </div>
      <div v-if="albums.length === 0" class="text-center py-20">
        <p class="text-[24px] text-dark/40">No albums found with these filters</p>
        <button @click="clearFilters" class="mt-4 text-accent text-[16px] font-bold cursor-pointer hover:opacity-70">
          Clear all filters
        </button>
      </div>
    </div>
  </div>
</template>