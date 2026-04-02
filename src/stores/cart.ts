import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Album, CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCart())
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
    saveCart()
    isOpen.value = true
  }

  function removeFromCart(albumId: string) {
    items.value = items.value.filter(item => item.album.id !== albumId)
    saveCart()
  }

  function updateQuantity(albumId: string, quantity: number) {
    const item = items.value.find(item => item.album.id === albumId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(albumId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  function clearCart() {
    items.value = []
    saveCart()
  }

  function saveCart() {
    localStorage.setItem('groove-cart', JSON.stringify(items.value))
  }

  function loadCart(): CartItem[] {
    const data = localStorage.getItem('groove-cart')
    return data ? JSON.parse(data) : []
  }

  return { items, isOpen, totalItems, subtotal, addToCart, removeFromCart, updateQuantity, clearCart }
})