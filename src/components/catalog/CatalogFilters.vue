<script setup lang="ts">
import { ref } from 'vue'
import type { Artist } from '@/types'

const props = defineProps<{
  artists: Artist[]
  genres: { id: string; name: string; color: string }[]
  availableDecades: string[]
  selectedArtists: string[]
  selectedGenres: string[]
  selectedDecades: string[]
  priceSort: string
  showOnSale: boolean
  showOutThisWeek: boolean
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  toggleArtist: [id: string]
  toggleGenre: [id: string]
  toggleDecade: [decade: string]
  setPriceSort: [sort: string]
  toggleOnSale: []
  toggleOutThisWeek: []
  clearFilters: []
}>()

const activeDropdown = ref<string | null>(null)

function toggleDropdown(name: string) {
  activeDropdown.value = activeDropdown.value === name ? null : name
}
</script>

<template>
  <div class="bg-dark">
    <div class="max-w-[var(--container)] mx-auto px-6 py-6">
      <div class="flex flex-wrap md:flex-nowrap gap-2 md:gap-4">
        <div class="relative flex-1">
          <button @click="toggleDropdown('artists')" class="w-full py-3 px-4 border border-light/30 rounded-sm text-light text-[14px] flex items-center justify-between cursor-pointer hover:border-light/60 transition-colors">
            <span>ARTISTS</span>
            <span class="text-[10px]" :class="activeDropdown === 'artists' ? 'rotate-180' : ''">▼</span>
          </button>
          <div v-if="activeDropdown === 'artists'" class="absolute top-full left-0 right-0 mt-1 bg-dark border border-light/20 rounded-sm z-50 max-h-[240px] overflow-y-auto">
            <label v-for="artist in [...artists].sort((a, b) => a.name.localeCompare(b.name))" :key="artist.id" class="flex items-center gap-3 px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer">
              <input type="checkbox" :checked="selectedArtists.includes(artist.id)" @change="emit('toggleArtist', artist.id)" class="w-4 h-4 accent-accent" />
              {{ artist.name }}
            </label>
          </div>
        </div>

        <div class="relative flex-1">
          <button @click="toggleDropdown('genre')" class="w-full py-3 px-4 border border-light/30 rounded-sm text-light text-[14px] flex items-center justify-between cursor-pointer hover:border-light/60 transition-colors">
            <span>GENRE</span>
            <span class="text-[10px]" :class="activeDropdown === 'genre' ? 'rotate-180' : ''">▼</span>
          </button>
          <div v-if="activeDropdown === 'genre'" class="absolute top-full left-0 right-0 mt-1 bg-dark border border-light/20 rounded-sm z-50 max-h-[240px] overflow-y-auto">
            <label v-for="genre in genres" :key="genre.id" class="flex items-center gap-3 px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer">
              <input type="checkbox" :checked="selectedGenres.includes(genre.id)" @change="emit('toggleGenre', genre.id)" class="w-4 h-4 accent-accent" />
              {{ genre.name.toUpperCase() }}
            </label>
          </div>
        </div>

        <div class="relative flex-1">
          <button @click="toggleDropdown('years')" class="w-full py-3 px-4 border border-light/30 rounded-sm text-light text-[14px] flex items-center justify-between cursor-pointer hover:border-light/60 transition-colors">
            <span>YEARS</span>
            <span class="text-[10px]" :class="activeDropdown === 'years' ? 'rotate-180' : ''">▼</span>
          </button>
          <div v-if="activeDropdown === 'years'" class="absolute top-full left-0 right-0 mt-1 bg-dark border border-light/20 rounded-sm z-50">
            <label v-for="decade in availableDecades" :key="decade" class="flex items-center gap-3 px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer">
              <input type="checkbox" :checked="selectedDecades.includes(decade)" @change="emit('toggleDecade', decade)" class="w-4 h-4 accent-accent" />
              {{ decade }}
            </label>
            <div class="border-t border-light/10 mt-1 pt-1">
              <label class="flex items-center gap-3 px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer">
                <input type="checkbox" :checked="showOutThisWeek" @change="emit('toggleOutThisWeek')" class="w-4 h-4 accent-accent" />
                OUT THIS WEEK
              </label>
            </div>
          </div>
        </div>

        <div class="relative flex-1">
          <button @click="toggleDropdown('price')" class="w-full py-3 px-4 border border-light/30 rounded-sm text-light text-[14px] flex items-center justify-between cursor-pointer hover:border-light/60 transition-colors">
            <span>PRICE</span>
            <span class="text-[10px]" :class="activeDropdown === 'price' ? 'rotate-180' : ''">▼</span>
          </button>
          <div v-if="activeDropdown === 'price'" class="absolute top-full left-0 right-0 mt-1 bg-dark border border-light/20 rounded-sm z-50">
            <button @click="emit('setPriceSort', 'low')" class="w-full text-left px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer flex items-center gap-3">
              <span class="w-4 h-4 border border-light/40 rounded-sm flex items-center justify-center text-[10px]">{{ priceSort === 'low' ? '✓' : '' }}</span>
              LOW TO HIGH
            </button>
            <button @click="emit('setPriceSort', 'high')" class="w-full text-left px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer flex items-center gap-3">
              <span class="w-4 h-4 border border-light/40 rounded-sm flex items-center justify-center text-[10px]">{{ priceSort === 'high' ? '✓' : '' }}</span>
              HIGH TO LOW
            </button>
            <div class="border-t border-light/10 mt-1 pt-1">
              <button @click="emit('toggleOnSale')" class="w-full text-left px-4 py-2 text-light text-[14px] hover:bg-light/5 cursor-pointer flex items-center gap-3">
                <span class="w-4 h-4 border border-light/40 rounded-sm flex items-center justify-center text-[10px]">{{ showOnSale ? '✓' : '' }}</span>
                ON SALE
              </button>
            </div>
          </div>
        </div>

        <button @click="emit('clearFilters')" class="px-8 py-3 text-dark text-[14px] font-bold cursor-pointer hover:bg-light/80 transition-colors" :class="hasActiveFilters ? 'bg-light' : 'bg-light/60'">
          CLEAR FILTERS
        </button>
      </div>
    </div>
  </div>

  <div v-if="activeDropdown" class="fixed inset-0 z-40" @click="activeDropdown = null"></div>
</template>