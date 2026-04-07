<template>
  <div class="max-w-[var(--container)] mx-auto px-6 py-24 text-center animate-page-in">
    <h1 class="text-[120px] md:text-[200px] font-bold leading-none text-dark/10">404</h1>
    <p class="text-[24px] font-bold mt-4">Page not found</p>
    <p class="text-[16px] text-dark/50 mt-2">The page you're looking for doesn't exist or has been moved.</p>
    <RouterLink to="/" class="inline-block mt-8 px-8 py-3 bg-dark text-light text-[14px] font-bold hover:bg-dark/80 transition-colors">
      Back to home
    </RouterLink>
  </div>
</template>