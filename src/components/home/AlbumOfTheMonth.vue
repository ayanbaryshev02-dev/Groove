<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Album } from '@/types'

const props = defineProps<{
  album: Album
}>()

const currentMonth = new Date().toLocaleString('en', { month: 'long' }).toUpperCase()

const vinylImage = computed(() => {
  const validColors = ['black', 'red', 'blue', 'green']
  const color = validColors.includes(props.album.vinylColor) ? props.album.vinylColor : 'black'
  return `/vinyl/${color}.webp`
})
</script>

<template>
  <section class="border-t border-dark/10">
    <div class="max-w-[1200px] mx-auto px-6 py-16">
      <h2 class="text-[48px] font-bold leading-none mb-10">ALBUM OF THE MONTH: {{ currentMonth }}</h2>
      <div class="grid grid-cols-2 gap-12 items-center">
        <div class="flex justify-center items-center">
          <div class="relative w-full" style="aspect-ratio: 3/2;">
            <img :src="`/covers/${album.id}.webp`" :alt="album.title" class="absolute left-0 top-1/2 -translate-y-1/2 h-[90%] aspect-square object-cover z-10 shadow-lg" @error="($event.target as HTMLImageElement).style.display = 'none'" />
            <img :src="vinylImage" alt="Vinyl" class="absolute right-0 top-1/2 -translate-y-1/2 h-[90%] aspect-square object-contain z-0" />
          </div>
        </div>
        <div>
          <RouterLink :to="`/artist/${album.artistId}`" class="text-[32px] font-bold hover:opacity-70 transition-opacity">
            {{ album.artistName }}
          </RouterLink>
          <h3 class="text-[24px] mt-1">{{ album.title }}</h3>
          <p class="text-[16px] text-dark/70 mt-4 leading-relaxed">{{ album.description }}</p>
          <RouterLink
            :to="`/album/${album.id}`"
            class="inline-block mt-6 px-8 py-3 bg-dark text-light text-[12px] hover:bg-dark/80 transition-colors"
          >
            Buy now
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>