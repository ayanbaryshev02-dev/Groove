<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFeatured, getGenres } from '@/api'
import type { Album } from '@/types'
import NewArrivals from '@/components/home/NewArrivals.vue'
import AlbumOfTheMonth from '@/components/home/AlbumOfTheMonth.vue'
import OutThisWeek from '@/components/home/OutThisWeek.vue'
import SalesSection from '@/components/home/SalesSection.vue'
import CatalogPreview from '@/components/home/CatalogPreview.vue'
import RecentlyViewed from '@/components/home/RecentlyViewed.vue'

const albumOfTheMonth = ref<Album | null>(null)
const outThisWeek = ref<Album[]>([])
const onSale = ref<Album[]>([])
const newArrivals = ref<Album[]>([])
const genres = ref<{ id: string; name: string; color: string }[]>([])
const isLoading = ref(true)

onMounted(async () => {
  const [featured, genresData] = await Promise.all([
    getFeatured(),
    getGenres()
  ])

  albumOfTheMonth.value = featured.albumOfTheMonth
  outThisWeek.value = featured.outThisWeek
  onSale.value = featured.onSale
  newArrivals.value = featured.newArrivals
  genres.value = genresData
  isLoading.value = false
})
</script>

<template>
  <div v-if="!isLoading">
    <NewArrivals :albums="newArrivals" />
    <AlbumOfTheMonth v-if="albumOfTheMonth" :album="albumOfTheMonth" />
    <OutThisWeek :albums="outThisWeek" />
    <SalesSection :albums="onSale" />
    <CatalogPreview :genres="genres" />
    <RecentlyViewed />
  </div>
</template>