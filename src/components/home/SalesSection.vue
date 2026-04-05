<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Album } from '@/types'
import AlbumCard from '@/components/shared/AlbumCard.vue'
import LeftArrow from '@/assets/icons/Left.svg'
import RightArrow from '@/assets/icons/Right.svg'

const props = defineProps<{
  albums: Album[]
}>()

const page = ref(0)
const isTransitioning = ref(false)
const visibleCount = 4

const totalPages = computed(() => Math.ceil(props.albums.length / visibleCount))
const canPrev = computed(() => page.value > 0)
const canNext = computed(() => page.value < totalPages.value - 1)
const visibleAlbums = computed(() => props.albums.slice(page.value * visibleCount, (page.value + 1) * visibleCount))

function prev() {
  if (!canPrev.value || isTransitioning.value) return
  animate(() => page.value--)
}

function next() {
  if (!canNext.value || isTransitioning.value) return
  animate(() => page.value++)
}

function animate(fn: () => void) {
  isTransitioning.value = true
  setTimeout(() => {
    fn()
    setTimeout(() => {
      isTransitioning.value = false
    }, 50)
  }, 200)
}
</script>

<template>
  <section class="bg-accent text-light">
    <div class="max-w-[1200px] mx-auto px-6 py-16 relative">
      <div class="flex items-end justify-between mb-8">
        <h2 class="text-[48px] font-bold leading-none text-light">SALES</h2>
        <RouterLink to="/catalog?sale=true" class="text-[16px] font-bold text-light hover:opacity-70 transition-opacity">
          see all
        </RouterLink>
      </div>
      <div class="relative">
        <button
          v-if="canPrev"
          @click="prev"
          class="absolute -left-12 top-1/3 -translate-y-1/2 z-10 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <img :src="LeftArrow" alt="Previous" class="w-8 h-8" />
        </button>

        <div
          class="grid grid-cols-4 gap-8 transition-opacity duration-200"
          :class="isTransitioning ? 'opacity-0' : 'opacity-100'"
        >
          <AlbumCard v-for="album in visibleAlbums" :key="album.id" :album="album" :light="true" />
        </div>

        <button
          v-if="canNext"
          @click="next"
          class="absolute -right-12 top-1/3 -translate-y-1/2 z-10 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <img :src="RightArrow" alt="Next" class="w-8 h-8" />
        </button>
      </div>
    </div>
  </section>
</template>