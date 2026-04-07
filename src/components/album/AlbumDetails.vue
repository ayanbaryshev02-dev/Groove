<script setup lang="ts">
import { ref } from 'vue'
import type { Album } from '@/types'
import LeftArrow from '@/assets/icons/Left.svg'
import RightArrow from '@/assets/icons/Right.svg'

defineProps<{ album: Album }>()
const isOpen = ref(false)
</script>

<template>
  <div class="border-t border-dark/10">
    <button
      @click="isOpen = !isOpen"
      class="w-full py-4 flex items-center justify-between cursor-pointer"
    >
      <span class="text-[20px] font-medium">DETAILS</span>
      <img
        :src="isOpen ? LeftArrow : RightArrow"
        alt=""
        class="w-5 h-5 transition-transform"
        :class="isOpen ? 'rotate-90' : '-rotate-90'"
        :style="{ filter: 'brightness(0)' }"
      />
    </button>
    <div v-if="isOpen" class="pb-6">
      <div class="space-y-2 text-[16px]">
        <div class="flex justify-between">
          <span class="font-bold">Release date</span>
          <span>{{ album.releaseDate }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Original Release Year</span>
          <span>{{ album.originalReleaseYear }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Vinyl colour</span>
          <span class="capitalize">{{ album.vinylColor.replace('-', ' ') }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Genre</span>
          <span class="capitalize">{{ album.genre.replace('-', ' / ') }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Number of discs</span>
          <span>{{ album.numberOfDiscs }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Catalogue number</span>
          <span>{{ album.catalogueNumber }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Vinyl weight</span>
          <span>{{ album.vinylWeight }}</span>
        </div>
      </div>
    </div>
  </div>
</template>