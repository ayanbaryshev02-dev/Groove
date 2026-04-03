<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Album } from '@/types'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{
  album: Album
  light?: boolean
}>()

const cart = useCartStore()

function addToCart(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  cart.addToCart(props.album)
}
</script>

<template>
  <div class="group">
    <RouterLink :to="`/album/${album.id}`" class="block relative">
      <div class="aspect-square mb-3 overflow-hidden relative" :class="light ? 'bg-white/10' : 'bg-dark/5'">
        <div class="w-full h-full group-hover:scale-105 transition-transform duration-300" :class="light ? 'bg-white/5' : 'bg-dark/10'"></div>
        <button
          @click="addToCart"
          class="absolute bottom-3 right-3 px-4 py-2 bg-light text-dark text-[13px] font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer hover:bg-white shadow-lg"
        >
          ADD TO CART
        </button>
      </div>
      <h3 class="text-[16px] font-bold leading-tight" :class="light ? 'text-light' : 'text-dark'">{{ album.title }}</h3>
    </RouterLink>
    <RouterLink
      :to="`/artist/${album.artistId}`"
      class="text-[14px] mt-0.5 block hover:opacity-70 transition-opacity"
      :class="light ? 'text-light/60' : 'text-dark/60'"
    >
      {{ album.artistName }}
    </RouterLink>
    <RouterLink :to="`/album/${album.id}`" class="flex items-center gap-2 mt-1">
      <span class="text-[14px]" :class="light ? 'text-light' : 'text-dark'">${{ album.price.toFixed(2) }}</span>
      <span v-if="album.originalPrice" class="text-[12px] line-through" :class="light ? 'text-light/50' : 'text-accent'">
        ${{ album.originalPrice.toFixed(2) }}
      </span>
    </RouterLink>
  </div>
</template>