import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Album, CartItem } from '@/types'

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

function safeSetItem(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error(`Failed to save ${key}`)
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(safeGetItem('groove-cart', []))
  const isOpen = ref(false)

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.album.price * item.quantity, 0)
  )

  function addToCart(album: Album) {
    const existing = items.value.find(item => item.album.id === album.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ album, quantity: 1 })
    }
    safeSetItem('groove-cart', items.value)
    isOpen.value = true
  }

  function removeFromCart(albumId: string) {
    items.value = items.value.filter(item => item.album.id !== albumId)
    safeSetItem('groove-cart', items.value)
  }

  function updateQuantity(albumId: string, quantity: number) {
    const item = items.value.find(item => item.album.id === albumId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(albumId)
      } else {
        item.quantity = quantity
        safeSetItem('groove-cart', items.value)
      }
    }
  }

  function clearCart() {
    items.value = []
    safeSetItem('groove-cart', items.value)
  }

  return { items, isOpen, totalItems, subtotal, addToCart, removeFromCart, updateQuantity, clearCart }
})