<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { getAlbum, getAlbums } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import type { Album } from '@/types'
import AlbumCard from '@/components/shared/AlbumCard.vue'
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
const showTracklist = ref(false)
const showDetails = ref(false)
const similarOffset = ref(0)

const canPrevSimilar = computed(() => similarOffset.value > 0)
const canNextSimilar = computed(() => similarOffset.value + 4 < similarAlbums.value.length)
const visibleSimilar = computed(() => similarAlbums.value.slice(similarOffset.value, similarOffset.value + 4))

function prevSimilar() {
  if (canPrevSimilar.value) similarOffset.value--
}

function nextSimilar() {
  if (canNextSimilar.value) similarOffset.value++
}

async function loadAlbum() {
  isLoading.value = true
  showTracklist.value = false
  showDetails.value = false
  similarOffset.value = 0

  const from = router.currentRoute.value
  const referrer = window.history.state?.back as string || '/'

  if (referrer.startsWith('/catalog')) {
    previousRoute.value = { name: 'catalog', path: referrer, label: 'Catalog' }
  } else if (referrer.startsWith('/artist/')) {
    previousRoute.value = { name: 'artist', path: referrer, label: '' }
  } else if (referrer === '/artists') {
    previousRoute.value = { name: 'artists', path: '/artists', label: 'Artists' }
  } else {
    previousRoute.value = { name: 'home', path: '/', label: 'Home' }
  }

  const id = route.params.id as string
  album.value = await getAlbum(id)

  if (album.value) {
    recentlyViewed.addAlbum(album.value)

    if (previousRoute.value.name === 'artist' && !previousRoute.value.label) {
      previousRoute.value.label = album.value.artistName
    }

    const allAlbums = await getAlbums()
    similarAlbums.value = allAlbums
      .filter(a => a.genre === album.value!.genre && a.id !== album.value!.id)
      .slice(0, 8)
  }

  isLoading.value = false
}

const releaseInfo = computed(() => {
  if (!album.value) return ''
  const date = new Date(album.value.releaseDate)
  const formatted = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  return album.value.isPreOrder ? `Release date: ${formatted} (Pre-order)` : `Release date: ${formatted}`
})

const vinylImage = computed(() => {
  const validColors = ['black', 'red', 'blue', 'green']
  const color = album.value && validColors.includes(album.value.vinylColor)
    ? album.value.vinylColor
    : 'black'
  return `/vinyl/${color}.webp`
})

const previousRoute = ref<{ name: string; path: string; label: string }>({ name: 'home', path: '/', label: 'Home' })

onMounted(loadAlbum)
watch(() => route.params.id, loadAlbum)
</script>

<template>
  <div v-if="!isLoading && album">
    <div class="max-w-[1200px] mx-auto px-6 pt-4 pb-2">
      <div class="flex items-center gap-2 text-[14px] text-dark/50">
        <RouterLink to="/" class="hover:text-dark transition-colors">Home</RouterLink>
        <span>›</span>
        <RouterLink v-if="previousRoute.name !== 'home'" :to="previousRoute.path" class="hover:text-dark transition-colors">{{ previousRoute.label }}</RouterLink>
        <span v-if="previousRoute.name !== 'home'">›</span>
        <span class="text-dark">{{ album.title }}</span>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-6 py-8">
      <div class="grid grid-cols-2 gap-16">
        <div class="sticky top-8 self-start">
          <div class="relative max-w-[320px]">
            <img :src="vinylImage" alt="Vinyl" class="absolute top-0 left-[50%] w-full h-full object-contain z-0" />
            <img :src="`/covers/${album.id}.webp`" :alt="album.title" class="relative z-10 w-full aspect-square object-cover" @error="($event.target as HTMLImageElement).style.display = 'none'" />
          </div>

          <div class="mt-10">
            <h3 class="text-[36px] font-bold">Description</h3>
            <p class="text-[16px] text-dark/70 mt-4 leading-relaxed max-w-[440px]">
              {{ album.description }}
            </p>
          </div>
        </div>

        <div>
          <RouterLink
            :to="`/artist/${album.artistId}`"
            class="text-[36px] font-bold hover:opacity-70 transition-opacity"
          >
            {{ album.artistName }}
          </RouterLink>
          <h1 class="text-[36px] mt-1">{{ album.title }}</h1>

          <div class="flex items-center gap-3 mt-4">
            <span class="text-[48px]">${{ album.price.toFixed(2) }}</span>
            <span v-if="album.originalPrice" class="text-[32px] text-accent line-through">
              ${{ album.originalPrice.toFixed(2) }}
            </span>
          </div>

          <div class="mt-4">
            <p class="text-[14px] font-bold">{{ releaseInfo }}</p>
            <p v-if="album.isPreOrder" class="text-[12px] text-dark/50 mt-1">
              Please note: This product has not yet been released.<br />
              Pre-order now to have it delivered around the release date.
            </p>
          </div>

          <button
            @click="cart.addToCart(album!)"
            class="mt-6 px-10 py-3 bg-dark text-light text-[14px] hover:bg-dark/80 transition-colors cursor-pointer"
          >
            {{ album.isPreOrder ? 'Pre-order' : 'Add to cart' }}
          </button>

          <div v-if="album.spotifyAlbumId" class="mt-8">
            <iframe
              :src="`https://open.spotify.com/embed/album/${album.spotifyAlbumId}?utm_source=generator&theme=0&size=large`"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              class="rounded-lg"
            ></iframe>
          </div>

          <div class="mt-8 border-t border-dark/10">
            <button
              @click="showTracklist = !showTracklist"
              class="w-full py-4 flex items-center justify-between cursor-pointer group"
            >
              <span class="text-[20px] font-medium">TRACKLIST</span>
              <img
                :src="showTracklist ? LeftArrow : RightArrow"
                alt=""
                class="w-5 h-5 transition-transform"
                :class="showTracklist ? 'rotate-90' : '-rotate-90'"
                :style="{ filter: 'brightness(0)' }"
              />
            </button>
            <div v-if="showTracklist" class="pb-6">
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

          <div class="border-t border-dark/10">
            <button
              @click="showDetails = !showDetails"
              class="w-full py-4 flex items-center justify-between cursor-pointer group"
            >
              <span class="text-[20px] font-medium">DETAILS</span>
              <img
                :src="showDetails ? LeftArrow : RightArrow"
                alt=""
                class="w-5 h-5 transition-transform"
                :class="showDetails ? 'rotate-90' : '-rotate-90'"
                :style="{ filter: 'brightness(0)' }"
              />
            </button>
            <div v-if="showDetails" class="pb-6">
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
        </div>
      </div>
    </div>

    <section v-if="similarAlbums.length" class="border-t border-dark/10">
      <div class="max-w-[1200px] mx-auto px-6 py-16 relative">
        <h2 class="text-[48px] font-bold leading-none mb-8">WE THINK YOU'LL LIKE</h2>
        <div class="relative">
          <button
            v-if="canPrevSimilar"
            @click="prevSimilar"
            class="absolute -left-12 top-1/3 -translate-y-1/2 z-10 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <img :src="LeftArrow" alt="Previous" class="w-8 h-8" />
          </button>
          <div class="grid grid-cols-4 gap-8">
            <AlbumCard v-for="a in visibleSimilar" :key="a.id" :album="a" />
          </div>
          <button
            v-if="canNextSimilar"
            @click="nextSimilar"
            class="absolute -right-12 top-1/3 -translate-y-1/2 z-10 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <img :src="RightArrow" alt="Next" class="w-8 h-8" />
          </button>
        </div>
      </div>
    </section>

    <RecentlyViewed />
  </div>
</template>