import { createRouter, createWebHistory } from 'vue-router'

const scrollPositions: Record<string, number> = {}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/views/CatalogView.vue')
    },
    {
      path: '/album/:id',
      name: 'album',
      component: () => import('@/views/AlbumView.vue')
    },
    {
      path: '/artists',
      name: 'artists',
      component: () => import('@/views/ArtistsView.vue')
    },
    {
      path: '/artist/:id',
      name: 'artist',
      component: () => import('@/views/ArtistView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    const saved = scrollPositions[to.fullPath]
    if (saved) {
      return { top: saved }
    }

    return { top: 0 }
  }
})

router.beforeEach((to, from) => {
  scrollPositions[from.fullPath] = window.scrollY
})

export default router