<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import TrashIcon from '@/assets/icons/Trash.svg'

const cart = useCartStore()
const router = useRouter()

function continueShopping() {
  cart.isOpen = false
}

function checkout() {
  cart.isOpen = false
  router.push('/catalog')
}

watch(() => cart.isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="cart.isOpen"
        class="fixed inset-0 bg-dark/50 z-50"
        @click="cart.isOpen = false"
      ></div>
    </Transition>

    <Transition name="slide">
      <div
        v-if="cart.isOpen"
        class="fixed top-0 right-0 bottom-0 w-[460px] bg-dark text-light z-50 flex flex-col"
      >
        <div class="flex-1 overflow-y-auto p-8">
          <h2 class="text-[24px] font-bold mb-8">YOUR CART</h2>

          <div v-if="cart.items.length === 0" class="text-light/40 text-[16px] text-center py-12">
            Your cart is empty
          </div>

          <div v-for="item in cart.items" :key="item.album.id" class="mb-8">
            <div class="flex gap-4">
              <div class="w-24 h-24 bg-white/10 shrink-0 overflow-hidden">
                <img :src="`/covers/${item.album.id}.webp`" :alt="item.album.title" class="w-full h-full object-cover" @error="($event.target as HTMLImageElement).style.display = 'none'" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <div>
                    <h3 class="text-[16px] font-bold text-light">{{ item.album.title }}</h3>
                    <p class="text-[14px] text-light/60">{{ item.album.artistName }}</p>
                  </div>
                  <span class="text-[16px] text-light">${{ (item.album.price * item.quantity).toFixed(2) }}</span>
                </div>
                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center border border-light/30">
                    <button
                      @click="cart.updateQuantity(item.album.id, item.quantity - 1)"
                      class="w-8 h-8 flex items-center justify-center text-light/60 hover:text-light cursor-pointer"
                    >−</button>
                    <span class="w-8 h-8 flex items-center justify-center text-[14px]">{{ item.quantity }}</span>
                    <button
                      @click="cart.updateQuantity(item.album.id, item.quantity + 1)"
                      class="w-8 h-8 flex items-center justify-center text-light/60 hover:text-light cursor-pointer"
                    >+</button>
                  </div>
                  <button
                    @click="cart.removeFromCart(item.album.id)"
                    class="cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <img :src="TrashIcon" alt="Remove" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-8 border-t border-light/10">
          <div class="flex items-center justify-between mb-6">
            <span class="text-[20px] font-bold">SUBTOTAL</span>
            <span class="text-[36px]">${{ cart.subtotal.toFixed(2) }}</span>
          </div>
          <button
            @click="continueShopping"
            class="w-full py-3 bg-light/20 text-light text-[14px] font-bold mb-3 cursor-pointer hover:bg-light/30 transition-colors"
          >
            CONTINUE SHOPPING
          </button>
          <button
            @click="checkout"
            class="w-full py-3 bg-light text-dark text-[14px] font-bold cursor-pointer hover:bg-light/90 transition-colors"
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>  