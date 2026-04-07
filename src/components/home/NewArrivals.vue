<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { Album } from '@/types'

const props = defineProps<{
  albums: Album[]
}>()

const activeIndex = ref(0)
const isTransitioning = ref(false)
let interval: ReturnType<typeof setInterval>
const progress = ref(0)
let animFrame: ReturnType<typeof requestAnimationFrame>
let startTime = 0
const DURATION = 5000

function startProgress() {
  startTime = Date.now()
  progress.value = 0

  function tick() {
    const elapsed = Date.now() - startTime
    progress.value = Math.min(elapsed / DURATION, 1)

    if (progress.value < 1) {
      animFrame = requestAnimationFrame(tick)
    }
  }

  animFrame = requestAnimationFrame(tick)
}

function goTo(index: number) {
  if (index === activeIndex.value) return
  isTransitioning.value = true

  setTimeout(() => {
    activeIndex.value = index
    isTransitioning.value = false
  }, 300)

  cancelAnimationFrame(animFrame)
  clearInterval(interval)
  startProgress()
  interval = setInterval(next, DURATION)
}

function next() {
  if (props.albums.length === 0) return
  const nextIndex = (activeIndex.value + 1) % props.albums.length
  goTo(nextIndex)
}

function getVinylImage(album: Album) {
  const validColors = ['black', 'red', 'blue', 'green']
  const color = validColors.includes(album.vinylColor) ? album.vinylColor : 'black'
  return `/vinyl/${color}.webp`
}

onMounted(() => {
  startProgress()
  interval = setInterval(next, DURATION)
})

onUnmounted(() => {
  clearInterval(interval)
  cancelAnimationFrame(animFrame)
})
</script>

<template>
  <section class="max-w-[1200px] mx-auto px-6 pt-12 pb-16">
    <h2 class="text-[32px] md:text-[48px] font-bold leading-none mb-6 md:mb-10">NEW ARRIVALS</h2>

    <div v-if="albums.length" class="mb-10">
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center transition-opacity duration-300"
        :class="isTransitioning ? 'opacity-0' : 'opacity-100'"
      >
        <div>
          <RouterLink :to="`/artist/${albums[activeIndex].artistId}`" class="text-[32px] font-bold leading-tight hover:opacity-70 transition-opacity">
            {{ albums[activeIndex].artistName }}
          </RouterLink>
          <RouterLink :to="`/album/${albums[activeIndex].id}`" class="text-[24px] leading-tight mt-1 block hover:opacity-70 transition-opacity">
            {{ albums[activeIndex].title }}
          </RouterLink>
          <p class="text-[16px] text-dark/70 mt-4 max-w-[500px] leading-relaxed">
            {{ albums[activeIndex].description }}
          </p>
          <RouterLink
            :to="`/album/${albums[activeIndex].id}`"
            class="inline-block mt-6 px-8 py-3 bg-dark text-light text-[12px] hover:bg-dark/80 transition-colors"
          >
            {{ albums[activeIndex].isPreOrder ? 'Pre-order' : 'Buy now' }}
          </RouterLink>
        </div>
        <RouterLink :to="`/album/${albums[activeIndex].id}`" class="flex justify-center items-center hover:opacity-90 transition-opacity">
          <div class="relative w-full" style="aspect-ratio: 4/3;">
            <img :src="`/covers/${albums[activeIndex].id}.webp`" :alt="albums[activeIndex].title" class="absolute left-0 top-1/2 -translate-y-1/2 h-[90%] aspect-square object-cover z-10 shadow-lg" @error="($event.target as HTMLImageElement).style.display = 'none'" />
            <img :src="getVinylImage(albums[activeIndex])" alt="Vinyl" class="absolute right-0 top-1/2 -translate-y-1/2 h-[90%] aspect-square object-contain z-0" />
          </div>
        </RouterLink>
      </div>
    </div>

    <div class="flex justify-between overflow-x-auto gap-4 md:gap-0">
      <button
        v-for="(album, index) in albums"
        :key="album.id"
        @click="goTo(index)"
        class="cursor-pointer"
      >
        <span
          class="text-[16px] font-bold transition-colors duration-300"
          :class="index === activeIndex ? 'text-dark' : 'text-dark/30'"
        >
          {{ album.title }}
        </span>
        <div v-if="index === activeIndex" class="h-[2px] mt-2 bg-dark/10 overflow-hidden">
          <div
            class="h-full bg-dark"
            :style="{ width: `${progress * 100}%` }"
          ></div>
        </div>
      </button>
    </div>
  </section>
</template>