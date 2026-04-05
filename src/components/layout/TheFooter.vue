<script setup lang="ts">
import LogoIcon from '@/assets/icons/Groove.svg'
import GithubIcon from '@/assets/icons/Github.svg'
import LinkedinIcon from '@/assets/icons/Linkedin.svg'
import GmailIcon from '@/assets/icons/Gmail.svg'
import TelegramIcon from '@/assets/icons/Telegram.svg'

const socials = [
  { icon: GithubIcon, url: 'https://github.com/ayanbaryshev02-dev', label: 'GitHub' },
  { icon: LinkedinIcon, url: 'https://www.linkedin.com/in/ayan-baryshev-4a38a2366/', label: 'LinkedIn' },
  { icon: GmailIcon, url: 'mailto:ayanbaryshev02@gmail.com', label: 'Gmail' },
  { icon: TelegramIcon, url: 'https://t.me/Ayanbaryshev', label: 'Telegram' }
]
</script>

<template>
  <footer class="bg-dark text-light">
    <div class="max-w-[1200px] mx-auto px-6 pt-16 pb-8">
      <div class="flex justify-center mb-12">
        <img :src="LogoIcon" alt="Groove" class="h-8" />
      </div>
      <div class="border-t border-light/10 pt-8 flex items-center justify-between">
        <button class="flex items-center gap-2 text-sm text-light/60 hover:text-light transition-colors cursor-pointer">
          <span class="text-base">🇬🇧</span>
          <span>English</span>
        </button>
        <div class="flex items-center gap-8">
          <a v-for="social in socials" :key="social.label" :href="social.url" target="_blank" rel="noopener noreferrer" class="opacity-60 hover:opacity-100 transition-opacity">
            <img :src="social.icon" :alt="social.label" class="w-6 h-6" />
          </a>
        </div>
        <p class="text-sm text-light/40">© 2026 Play it loud.</p>
      </div>
    </div>
  </footer>
</template>