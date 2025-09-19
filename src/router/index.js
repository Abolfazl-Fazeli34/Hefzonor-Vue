import { createRouter, createWebHistory } from 'vue-router'
import TabbedContent from '@/components/TabbedContent.vue'
import QuranDetails from '@/components/QuranDetails.vue'

const routes = [
  {
    path: '/',
    name: "Home", 
    component: () => import('@/components/HomeComponent.vue')
  },

  // مسیر سوره
  {
    path: '/quran/:surahno',
    name: 'quran-surah',
    component: TabbedContent,
    props: true
  },

  // مسیر جزء
  {
    path: '/quran/juz/:juzno',
    name: 'quran-juz',
    component: TabbedContent,
    props: true
  },

  // مسیر صفحه
  {
    path: '/quran/page/:pageno',
    name: 'quran-page',
    component: TabbedContent,
    props: true
  },

  {
    path: '/Search', 
    name: 'Search', 
    component: () => import('@/components/SearchComponent.vue'),
  },
  {
    path: '/quran/details/:surahno/:verse_number', 
    name: 'quran-details', 
    component: QuranDetails,
    props: true,
  },
  {
    path: '/testcom',
    name: 'testcom',
    component: () => import('@/components/TestComponent.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/LoginPage/LoginComponent.vue')
  },
  {
    path: '/qurans/:surahno',
    name: 'QuranPage',
    component: () => import('@/components/QuranPage.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
