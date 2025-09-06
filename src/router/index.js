import { createRouter, createWebHistory } from 'vue-router'
import TabbedContent from '@/components/TabbedContent.vue'
import QuranDetails from '@/components/QuranDetails.vue'

const routes = [
  {
    path: '/',
    name: "Home", 
    component: () => import('@/components/HomeComponent.vue')
  },
  {
    path: '/quran', 
    name: 'quran', 
    component: TabbedContent,
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
    props: true, // این خط باعث می‌شود مقادیر پارامترها به عنوان props به کامپوننت ارسال شوند
  },
 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
