<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  title: string
  link?: string
  dark?: boolean
}>()
</script>

<template>
  <div class="flex items-end justify-between mb-8">
    <h2 class="text-[48px] font-bold leading-none" :class="dark ? 'text-light' : 'text-dark'">
      {{ title }}
    </h2>
    <RouterLink
      v-if="link"
      :to="link"
      class="text-[16px] font-bold hover:opacity-70 transition-opacity"
      :class="dark ? 'text-light' : 'text-dark'"
    >
      see all
    </RouterLink>
  </div>
</template>