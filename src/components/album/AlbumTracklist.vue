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
      <span class="text-[20px] font-medium">TRACKLIST</span>
      <img
        :src="isOpen ? LeftArrow : RightArrow"
        alt=""
        class="w-5 h-5 transition-transform"
        :class="isOpen ? 'rotate-90' : '-rotate-90'"
        :style="{ filter: 'brightness(0)' }"
      />
    </button>
    <div v-if="isOpen" class="pb-6">
      <div v-for="side in album.tracklist" :key="side.side" class="mb-4">
        <p class="text-[14px] font-bold text-dark/40 mb-2">SIDE {{ side.side }}</p>
        <div
          v-for="track in side.tracks"
          :key="track.number"
          class="flex justify-between py-1.5 text-[16px]"
        >
          <span>{{ track.number }}. {{ track.title }}</span>
          <span class="text-dark/40">{{ track.duration }}</span>
        </div>
      </div>
    </div>
  </div>
</template>