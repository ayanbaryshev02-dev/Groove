<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { getAlbum, getSimilarAlbums } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import type { Album } from '@/types'
import AlbumCard from '@/components/shared/AlbumCard.vue'
import AlbumTracklist from '@/components/album/AlbumTracklist.vue'
import AlbumDetails from '@/components/album/AlbumDetails.vue'
import RecentlyViewed from '@/components/home/RecentlyViewed.vue'
import LeftArrow from '@/assets/icons/Left.svg'
import RightArrow from '@/assets/icons/Right.svg'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const recentlyViewed = useRecentlyViewedStore()

const album = ref<Album | null>(null)
const similarAlbums = ref<Album[]>([])
const isLoading = ref(true)
const similarOffset = ref(0)
const previousRoute = ref<{ name: string; label: string }>({ name: 'home', label: '' })

const canPrevSimilar = computed(() => similarOffset.value > 0)
const canNextSimilar = computed(() => similarOffset.value + 4 < similarAlbums.value.length)
const visibleSimilar = computed(() => similarAlbums.value.slice(similarOffset.value, similarOffset.value + 4))

const releaseInfo = computed(() => {
  if (!album.value) return ''
  const date = new Date(album.value.releaseDate)
  const formatted = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  return album.value.isPreOrder ? `Release date: ${formatted} (Pre-order)` : `Release date: ${formatted}`
})

const vinylImage = computed(() => {
  const validColors = ['black', 'red', 'blue', 'green']
  const color = album.value && validColors.includes(album.value.vinylColor) ? album.value.vinylColor : 'black'
  return `/vinyl/${color}.webp`
})

async function loadAlbum() {
  isLoading.value = true
  similarOffset.value = 0

  const referrer = window.history.state?.back as string || '/'

  if (referrer.startsWith('/catalog')) {
    previousRoute.value = { name: 'catalog', label: 'Catalog' }
  } else if (referrer.startsWith('/artist/')) {
    previousRoute.value = { name: 'artist', label: '' }
  } else if (referrer === '/artists') {
    previousRoute.value = { name: 'artists', label: 'Artists' }
  } else if (referrer.startsWith('/album/')) {
    previousRoute.value = { name: 'album', label: '' }
  } else {
    previousRoute.value = { name: 'home', label: '' }
  }

  const id = route.params.id as string
  album.value = await getAlbum(id)

  if (album.value) {
    recentlyViewed.addAlbum(album.value)

    if (previousRoute.value.name === 'artist' && !previousRoute.value.label) {
      previousRoute.value.label = album.value.artistName
    }

    if (previousRoute.value.name === 'album' && !previousRoute.value.label) {
      const prevId = referrer.split('/album/')[1]
      if (prevId) {
        const prevAlbum = await getAlbum(prevId)
        previousRoute.value.label = prevAlbum?.title || 'Album'
      }
    }

    similarAlbums.value = await getSimilarAlbums(id)
  }

  isLoading.value = false
}

onMounted(loadAlbum)
watch(() => route.params.id, loadAlbum)
</script>

<template>
  <div v-if="!isLoading && album" class="animate-page-in">
    <div class="max-w-[var(--container)] mx-auto px-6 pt-4 pb-2">
      <div class="flex items-center gap-2 text-[14px] text-dark/50">
        <button @click="router.back()" class="hover:text-dark transition-colors cursor-pointer">
          {{ previousRoute.label || 'Home' }}
        </button>
        <span>›</span>
        <span class="text-dark">{{ album.title }}</span>
      </div>
    </div>

    <div class="max-w-[var(--container)] mx-auto px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <div class="md:sticky md:top-8 self-start">
          <div class="relative max-w-[220px] md:max-w-[320px]">
            <img :src="vinylImage" alt="Vinyl" class="absolute top-0 left-[50%] w-full h-full object-contain z-0 hidden md:block" />
            <img :src="`/covers/${album.id}.webp`" :alt="album.title" class="relative z-10 w-full aspect-square object-cover shadow-lg" @error="($event.target as HTMLImageElement).style.display = 'none'" />
          </div>
          <div class="mt-10">
            <h3 class="text-[28px] md:text-[36px] font-bold">Description</h3>
            <p class="text-[16px] text-dark/70 mt-4 leading-relaxed max-w-[440px]">{{ album.description }}</p>
          </div>
        </div>

        <div>
          <RouterLink :to="`/artist/${album.artistId}`" class="text-[28px] md:text-[36px] font-bold hover:opacity-70 transition-opacity">
            {{ album.artistName }}
          </RouterLink>
          <h1 class="text-[28px] md:text-[36px] mt-1">{{ album.title }}</h1>

          <div class="flex items-center gap-3 mt-4">
            <span class="text-[36px] md:text-[48px]">${{ album.price.toFixed(2) }}</span>
            <span v-if="album.originalPrice" class="text-[32px] text-accent line-through">${{ album.originalPrice.toFixed(2) }}</span>
          </div>

          <div class="mt-4">
            <p class="text-[14px] font-bold">{{ releaseInfo }}</p>
            <p v-if="album.isPreOrder" class="text-[12px] text-dark/50 mt-1">
              Please note: This product has not yet been released.<br />
              Pre-order now to have it delivered around the release date.
            </p>
          </div>

          <button @click="cart.addToCart(album!)" class="mt-6 px-10 py-3 bg-dark text-light text-[14px] hover:bg-dark/80 transition-colors cursor-pointer">
            {{ album.isPreOrder ? 'Pre-order' : 'Add to cart' }}
          </button>

          <div v-if="album.spotifyAlbumId" class="mt-8">
            <iframe
              :src="`https://open.spotify.com/embed/album/${album.spotifyAlbumId}?utm_source=generator&theme=0&size=large`"
              width="100%" height="352" frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy" class="rounded-lg"
            ></iframe>
          </div>

          <div class="mt-8">
            <AlbumTracklist :album="album" />
            <AlbumDetails :album="album" />
          </div>
        </div>
      </div>
    </div>

    <section v-if="similarAlbums.length" class="border-t border-dark/10">
      <div class="max-w-[var(--container)] mx-auto px-6 py-16 relative">
        <h2 class="text-[32px] md:text-[48px] font-bold leading-none mb-6 md:mb-8">WE THINK YOU'LL LIKE</h2>
        <div class="relative">
          <button v-if="canPrevSimilar" @click="similarOffset--" class="absolute -left-12 top-1/3 -translate-y-1/2 z-10 cursor-pointer hover:opacity-70 transition-opacity hidden md:block">
            <img :src="LeftArrow" alt="Previous" class="w-8 h-8" />
          </button>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <AlbumCard v-for="a in visibleSimilar" :key="a.id" :album="a" />
          </div>
          <button v-if="canNextSimilar" @click="similarOffset++" class="absolute -right-12 top-1/3 -translate-y-1/2 z-10 cursor-pointer hover:opacity-70 transition-opacity hidden md:block">
            <img :src="RightArrow" alt="Next" class="w-8 h-8" />
          </button>
        </div>
      </div>
    </section>

    <RecentlyViewed />
  </div>
</template>