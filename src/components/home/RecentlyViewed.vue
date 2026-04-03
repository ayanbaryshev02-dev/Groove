<script setup lang="ts">
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import AlbumCard from '@/components/shared/AlbumCard.vue'

const store = useRecentlyViewedStore()
</script>

<template>
  <section v-if="store.albums.length" class="border-t border-dark/10">
    <div class="max-w-[1200px] mx-auto px-6 py-16">
      <h2 class="text-[48px] font-bold leading-none mb-8">RECENTLY VIEWED</h2>
      <div class="grid grid-cols-4 gap-8">
        <AlbumCard v-for="album in store.albums.slice(0, 4)" :key="album.id" :album="album" />
      </div>
    </div>
  </section>
</template>