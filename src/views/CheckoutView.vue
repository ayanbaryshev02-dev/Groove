<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()

const step = ref(1)
const isSubmitting = ref(false)
const orderComplete = ref(false)

const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  country: 'Kazakhstan',
  city: '',
  address: '',
  zipCode: '',
  phone: '',
  saveInfo: false
})

const errors = ref<Record<string, string>>({})

const shipping = computed(() => cart.subtotal > 100 ? 0 : 9.99)
const total = computed(() => cart.subtotal + shipping.value)

function validateContact() {
  errors.value = {}
  if (!form.value.email) errors.value.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Invalid email'
  return Object.keys(errors.value).length === 0
}

function validateDelivery() {
  errors.value = {}
  if (!form.value.firstName) errors.value.firstName = 'First name is required'
  if (!form.value.lastName) errors.value.lastName = 'Last name is required'
  if (!form.value.city) errors.value.city = 'City is required'
  if (!form.value.address) errors.value.address = 'Address is required'
  if (!form.value.zipCode) errors.value.zipCode = 'ZIP code is required'
  return Object.keys(errors.value).length === 0
}

function nextStep() {
  if (step.value === 1 && validateContact()) {
    step.value = 2
  } else if (step.value === 2 && validateDelivery()) {
    step.value = 3
  }
}

function prevStep() {
  if (step.value > 1) step.value--
}

async function placeOrder() {
  isSubmitting.value = true

  await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: cart.items,
      customer: form.value,
      subtotal: cart.subtotal,
      shipping: shipping.value,
      total: total.value
    })
  }).catch(() => {})

  cart.clearCart()
  isSubmitting.value = false
  orderComplete.value = true
}

onMounted(() => {
  if (cart.items.length === 0 && !orderComplete.value) {
    router.push('/catalog')
  }
})


</script>

<template>
  <div class="animate-page-in">
    <div class="max-w-[var(--container)] mx-auto px-6 pt-4 pb-2">
      <div class="flex items-center gap-2 text-[14px] text-dark/50">
        <RouterLink to="/" class="hover:text-dark transition-colors">Home</RouterLink>
        <span>›</span>
        <span class="text-dark">Checkout</span>
      </div>
    </div>

    <div v-if="orderComplete" class="max-w-[600px] mx-auto px-6 py-24 text-center">
      <h1 class="text-[48px] font-bold mb-4">Thank you!</h1>
      <p class="text-[18px] text-dark/60 mb-8">Your order has been placed successfully. We'll send you a confirmation email shortly.</p>
      <RouterLink to="/" class="inline-block px-8 py-3 bg-dark text-light text-[14px] hover:bg-dark/80 transition-colors">
        Continue shopping
      </RouterLink>
    </div>

    <div v-else class="max-w-[var(--container)] mx-auto px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-16">
        <div class="md:col-span-3">
          <div class="flex gap-4 mb-8">
            <button
              v-for="s in [1, 2, 3]"
              :key="s"
              class="flex items-center gap-2 text-[14px] font-bold"
              :class="s === step ? 'text-dark' : s < step ? 'text-dark/40 cursor-pointer' : 'text-dark/20'"
              @click="s < step ? step = s : null"
            >
              <span
                class="w-7 h-7 rounded-full flex items-center justify-center text-[12px]"
                :class="s <= step ? 'bg-dark text-light' : 'bg-dark/10 text-dark/30'"
              >{{ s }}</span>
              {{ s === 1 ? 'Contact' : s === 2 ? 'Delivery' : 'Payment' }}
            </button>
          </div>

          <div v-if="step === 1">
            <h2 class="text-[24px] font-bold mb-6">Contact</h2>
            <div class="space-y-4">
              <div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email"
                  class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                  :class="errors.email ? 'border-accent' : ''"
                />
                <p v-if="errors.email" class="text-accent text-[12px] mt-1">{{ errors.email }}</p>
              </div>
              <label class="flex items-center gap-3 text-[14px] text-dark/60 cursor-pointer">
                <input v-model="form.saveInfo" type="checkbox" class="w-4 h-4 accent-dark" />
                Join our mailing list to stay in tune with new releases
              </label>
            </div>
            <button
              @click="nextStep"
              class="mt-8 w-full py-3 bg-dark text-light text-[14px] font-bold hover:bg-dark/80 transition-colors cursor-pointer"
            >
              Continue to delivery
            </button>
          </div>

          <div v-if="step === 2">
            <h2 class="text-[24px] font-bold mb-6">Delivery</h2>
            <div class="space-y-4">
              <div>
                <select
                  v-model="form.country"
                  class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors bg-white"
                >
                  <option>Kazakhstan</option>
                  <option>Russia</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Japan</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input
                    v-model="form.firstName"
                    type="text"
                    placeholder="First name"
                    class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                    :class="errors.firstName ? 'border-accent' : ''"
                  />
                  <p v-if="errors.firstName" class="text-accent text-[12px] mt-1">{{ errors.firstName }}</p>
                </div>
                <div>
                  <input
                    v-model="form.lastName"
                    type="text"
                    placeholder="Last name"
                    class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                    :class="errors.lastName ? 'border-accent' : ''"
                  />
                  <p v-if="errors.lastName" class="text-accent text-[12px] mt-1">{{ errors.lastName }}</p>
                </div>
              </div>
              <div>
                <input
                  v-model="form.address"
                  type="text"
                  placeholder="Address"
                  class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                  :class="errors.address ? 'border-accent' : ''"
                />
                <p v-if="errors.address" class="text-accent text-[12px] mt-1">{{ errors.address }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input
                    v-model="form.city"
                    type="text"
                    placeholder="City"
                    class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                    :class="errors.city ? 'border-accent' : ''"
                  />
                  <p v-if="errors.city" class="text-accent text-[12px] mt-1">{{ errors.city }}</p>
                </div>
                <div>
                  <input
                    v-model="form.zipCode"
                    type="text"
                    placeholder="ZIP code"
                    class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                    :class="errors.zipCode ? 'border-accent' : ''"
                  />
                  <p v-if="errors.zipCode" class="text-accent text-[12px] mt-1">{{ errors.zipCode }}</p>
                </div>
              </div>
              <div>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="Phone (optional)"
                  class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                />
              </div>
            </div>
            <div class="flex gap-4 mt-8">
              <button
                @click="prevStep"
                class="px-8 py-3 border border-dark/20 text-[14px] font-bold hover:bg-dark/5 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                @click="nextStep"
                class="flex-1 py-3 bg-dark text-light text-[14px] font-bold hover:bg-dark/80 transition-colors cursor-pointer"
              >
                Continue to payment
              </button>
            </div>
          </div>

          <div v-if="step === 3">
            <h2 class="text-[24px] font-bold mb-6">Payment</h2>
            <div class="border border-dark/20 p-6 mb-6">
              <p class="text-[14px] text-dark/50 mb-4">This is a demo store. No real payment will be processed.</p>
              <div class="space-y-4">
                <input
                  type="text"
                  placeholder="Card number"
                  value="4242 4242 4242 4242"
                  class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                  disabled
                />
                <div class="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    value="12 / 28"
                    class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                    disabled
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    value="123"
                    class="w-full px-4 py-3 border border-dark/20 text-[16px] outline-none focus:border-dark transition-colors"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div class="flex gap-4">
              <button
                @click="prevStep"
                class="px-8 py-3 border border-dark/20 text-[14px] font-bold hover:bg-dark/5 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                @click="placeOrder"
                :disabled="isSubmitting"
                class="flex-1 py-3 bg-dark text-light text-[14px] font-bold hover:bg-dark/80 transition-colors cursor-pointer disabled:opacity-50"
              >
                {{ isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}` }}
              </button>
            </div>
          </div>
        </div>

        <div class="md:col-span-2 order-first md:order-last">
          <div class="bg-dark/[0.03] p-6 sticky top-8">
            <div v-for="item in cart.items" :key="item.album.id" class="flex gap-4 mb-4">
              <div class="relative w-16 h-16 bg-dark/10 shrink-0 overflow-hidden">
                <img :src="`/covers/${item.album.id}.webp`" :alt="item.album.title" class="w-full h-full object-cover" />
                <span class="absolute -top-1 -right-1 bg-dark text-light text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {{ item.quantity }}
                </span>
              </div>
              <div class="flex-1 flex justify-between items-start">
                <div>
                  <p class="text-[14px] font-bold">{{ item.album.title }}</p>
                  <p class="text-[12px] text-dark/50">{{ item.album.artistName }}</p>
                </div>
                <p class="text-[14px]">${{ (item.album.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>

            <div class="border-t border-dark/10 pt-4 mt-4 space-y-2">
              <div class="flex justify-between text-[14px]">
                <span class="text-dark/60">Subtotal · {{ cart.totalItems }} items</span>
                <span>${{ cart.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-[14px]">
                <span class="text-dark/60">Shipping</span>
                <span>{{ shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}` }}</span>
              </div>
              <div class="flex justify-between text-[18px] font-bold pt-2 border-t border-dark/10">
                <span>Total</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>