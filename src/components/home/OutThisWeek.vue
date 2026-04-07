<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Album } from '@/types'
import SectionHeader from '@/components/shared/SectionHeader.vue'
import AlbumCarousel from '@/components/shared/AlbumCarousel.vue'

defineProps<{
  albums: Album[]
}>()
</script>

<template>
  <section class="bg-dark text-light">
    <div class="max-w-[var(--container)] mx-auto px-6 py-16 relative">
      <SectionHeader title="OUT THIS WEEK" link="/catalog?outThisWeek=true" :light="true" />
      <AlbumCarousel :albums="albums" :light="true" />
    </div>
  </section>
</template>