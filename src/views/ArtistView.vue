<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getArtist } from '@/api'
import type { Artist, Album } from '@/types'
import AlbumCard from '@/components/shared/AlbumCard.vue'
import RecentlyViewed from '@/components/home/RecentlyViewed.vue'

const route = useRoute()

const artist = ref<(Artist & { albums: Album[] }) | null>(null)
const isLoading = ref(true)

async function loadArtist() {
  isLoading.value = true
  const id = route.params.id as string
  artist.value = await getArtist(id)
  isLoading.value = false
}

onMounted(loadArtist)
watch(() => route.params.id, loadArtist)
</script>

<template>
  <div v-if="!isLoading && artist">
    <div class="max-w-[1200px] mx-auto px-6 pt-4 pb-2">
      <div class="flex items-center gap-2 text-[14px] text-dark/50">
        <RouterLink to="/" class="hover:text-dark transition-colors">Home</RouterLink>
        <span>›</span>
        <span class="text-dark">{{ artist.name }}</span>
      </div>
    </div>

    <div class="w-full h-[280px] bg-dark/10 overflow-hidden">
      <img
        :src="`/artists/${artist.id}.jpg`"
        :alt="artist.name"
        class="w-full h-full object-cover object-top"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
    </div>

    <div class="max-w-[1200px] mx-auto px-6 py-16">
      <div class="grid grid-cols-2 gap-16 mb-16">
        <h1 class="text-[64px] font-bold leading-none">{{ artist.name }}</h1>
        <p class="text-[16px] text-dark/70 leading-relaxed self-center">{{ artist.bio }}</p>
      </div>

      <div class="grid grid-cols-4 gap-x-8 gap-y-12">
        <AlbumCard v-for="album in artist.albums" :key="album.id" :album="album" />
      </div>

      <div v-if="artist.albums.length === 0" class="text-center py-12">
        <p class="text-[20px] text-dark/40">No albums available yet</p>
      </div>
    </div>

    <RecentlyViewed />
  </div>
</template>