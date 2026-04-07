<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { getArtist } from '@/api'
import type { Artist, Album } from '@/types'
import AlbumCard from '@/components/shared/AlbumCard.vue'
import RecentlyViewed from '@/components/home/RecentlyViewed.vue'

const route = useRoute()
const router = useRouter()

const artist = ref<(Artist & { albums: Album[] }) | null>(null)
const isLoading = ref(true)
const previousRoute = ref<{ name: string; label: string }>({ name: 'home', label: '' })

async function loadArtist() {
  isLoading.value = true

  const referrer = window.history.state?.back as string || '/'

  if (referrer.startsWith('/catalog')) {
    previousRoute.value = { name: 'catalog', label: 'Catalog' }
  } else if (referrer.startsWith('/album/')) {
    previousRoute.value = { name: 'album', label: 'Album' }
  } else if (referrer === '/artists') {
    previousRoute.value = { name: 'artists', label: 'Artists' }
  } else {
    previousRoute.value = { name: 'home', label: '' }
  }

  const id = route.params.id as string
  artist.value = await getArtist(id)
  isLoading.value = false
}

onMounted(loadArtist)
watch(() => route.params.id, loadArtist)
</script>

<template>
  <div v-if="!isLoading && artist" class="animate-page-in">
    <div class="max-w-[1200px] mx-auto px-6 pt-4 pb-2">
      <div class="flex items-center gap-2 text-[14px] text-dark/50">
        <button
          @click="previousRoute.label ? router.go(-2) : router.back()"
          class="hover:text-dark transition-colors cursor-pointer"
        >Home</button>
        <template v-if="previousRoute.label">
          <span>›</span>
          <button @click="router.back()" class="hover:text-dark transition-colors cursor-pointer">{{ previousRoute.label }}</button>
        </template>
        <span>›</span>
        <span class="text-dark">{{ artist.name }}</span>
      </div>
    </div>

    <div class="w-full h-[160px] md:h-[280px] bg-dark/10 overflow-hidden">
       <img
        :src="`/artists/${artist.id}-banner.webp`"
        :alt="artist.name"
        class="w-full h-full object-cover object-top"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
    </div>

    <div class="max-w-[1200px] mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-10 md:mb-16">
        <h1 class="text-[36px] md:text-[64px] font-bold leading-none">{{ artist.name }}</h1>
        <p class="text-[16px] text-dark/70 leading-relaxed self-center">{{ artist.bio }}</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
        <AlbumCard v-for="album in artist.albums" :key="album.id" :album="album" />
      </div>

      <div v-if="artist.albums.length === 0" class="text-center py-12">
        <p class="text-[20px] text-dark/40">No albums available yet</p>
      </div>
    </div>

    <RecentlyViewed />
  </div>
</template>