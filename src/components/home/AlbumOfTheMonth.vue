<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Album } from '@/types'

defineProps<{
  album: Album
}>()

const currentMonth = new Date().toLocaleString('en', { month: 'long' }).toUpperCase()
</script>

<template>
  <section class="border-t border-dark/10">
    <div class="max-w-[1200px] mx-auto px-6 py-16">
      <h2 class="text-[48px] font-bold leading-none mb-10">ALBUM OF THE MONTH: {{ currentMonth }}</h2>
      <div class="grid grid-cols-2 gap-12 items-center">
        <div class="aspect-square max-w-[360px] bg-dark/5"></div>
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