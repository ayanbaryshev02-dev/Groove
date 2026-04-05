<script setup lang="ts">
import { useRoute } from 'vue-router'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import CartSidebar from '@/components/layout/CartSidebar.vue'

const route = useRoute()
const cachedViews = ['HomeView', 'CatalogView', 'ArtistsView']
</script>

<template>
  <TheHeader />
  <main class="min-h-screen">
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="cachedViews">
        <component :is="Component" :key="route.name" />
      </KeepAlive>
    </RouterView>
  </main>
  <TheFooter />
  <CartSidebar />
</template>