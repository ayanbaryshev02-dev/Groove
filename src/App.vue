<script setup lang="ts">
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import CartSidebar from '@/components/layout/CartSidebar.vue'
</script>

<template>
  <TheHeader />
  <main class="min-h-screen">
    <RouterView />
  </main>
  <TheFooter />
  <CartSidebar />
</template>