<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Album } from '@/types'
import AlbumCard from '@/components/shared/AlbumCard.vue'
import LeftArrow from '@/assets/icons/Left.svg'
import RightArrow from '@/assets/icons/Right.svg'
import { useDragScroll } from '@/composables/useDragScroll'

const props = defineProps<{
  albums: Album[]
  light?: boolean
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

const { isDragging, onPointerDown, onPointerMove, onPointerUp } = useDragScroll(next, prev)
</script>

<template>
  <div class="relative">
    <button
      v-if="canPrev"
      @click="prev"
      class="absolute -left-12 top-1/3 -translate-y-1/2 z-10 cursor-pointer hover:opacity-70 transition-opacity"
    >
      <img :src="LeftArrow" alt="Previous" class="w-8 h-8 light" />
    </button>

    <div
      class="grid grid-cols-4 gap-8 transition-opacity duration-200 select-none"
      :class="[isTransitioning ? 'opacity-0' : 'opacity-100', isDragging ? 'cursor-grabbing' : 'cursor-grab']"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <AlbumCard v-for="album in visibleAlbums" :key="album.id" :album="album" :light="light" />
    </div>

    <button
      v-if="canNext"
      @click="next"
      class="absolute -right-12 top-1/3 -translate-y-1/2 z-10 cursor-pointer hover:opacity-70 transition-opacity"
    >
      <img :src="RightArrow" alt="Next" class="w-8 h-8 light" />
    </button>
  </div>
</template>