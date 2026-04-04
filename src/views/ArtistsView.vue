<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getArtists } from '@/api'
import type { Artist } from '@/types'
import RecentlyViewed from '@/components/home/RecentlyViewed.vue'

const artists = ref<Artist[]>([])
const isLoading = ref(true)

onMounted(async () => {
  artists.value = await getArtists()
  isLoading.value = false
})
</script>

<template>
  <div v-if="!isLoading">
    <div class="max-w-[1200px] mx-auto px-6 pt-4 pb-2">
      <div class="flex items-center gap-2 text-[14px] text-dark/50">
        <RouterLink to="/" class="hover:text-dark transition-colors">Home</RouterLink>
        <span>›</span>
        <span class="text-dark">Artists</span>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-6 py-12">
      <div class="grid grid-cols-4 gap-x-8 gap-y-10">
        <RouterLink
          v-for="artist in [...artists].sort((a, b) => a.name.localeCompare(b.name))"
          :key="artist.id"
          :to="`/artist/${artist.id}`"
          class="group"
        >
          <div class="aspect-square bg-dark/5 overflow-hidden mb-3">
            <img
              :src="`/artists/${artist.id}.webp`"
              :alt="artist.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            />
          </div>
          <h3 class="text-[16px] font-bold group-hover:opacity-70 transition-opacity">{{ artist.name }}</h3>
        </RouterLink>
      </div>
    </div>

    <RecentlyViewed />
  </div>
</template>