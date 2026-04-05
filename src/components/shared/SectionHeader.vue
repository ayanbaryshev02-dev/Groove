<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  title: string
  link: string
  light?: boolean
}>()
</script>

<template>
  <div class="flex items-end justify-between mb-8">
    <h2 class="text-[48px] font-bold leading-none">{{ title }}</h2>
    <RouterLink :to="link" class="text-[16px] font-bold hover:opacity-70 transition-opacity">
      see all
    </RouterLink>
  </div>
</template>