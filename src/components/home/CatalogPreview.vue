<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SectionHeader from '@/components/shared/SectionHeader.vue'

defineProps<{
  genres: { id: string; name: string; color: string }[]
}>()
</script>

<template>
  <section class="border-t border-dark/10">
    <div class="max-w-[1200px] mx-auto px-6 py-16">
      <SectionHeader title="CATALOG" link="/catalog" />
      <div class="flex gap-4">
        <RouterLink
          v-for="genre in genres.slice(0, 5)"
          :key="genre.id"
          :to="`/catalog?genre=${genre.id}`"
          class="flex-1 aspect-[4/3] rounded-sm flex items-center justify-center text-light text-[20px] font-bold hover:scale-105 transition-transform"
          :style="{ backgroundColor: genre.color }"
        >
          {{ genre.name }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>