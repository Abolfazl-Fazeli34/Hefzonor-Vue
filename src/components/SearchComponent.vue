<template>
<div class="max-w-screen-lg mb-32 mt-12 md:mt-16 mx-auto">
  <form class="flex items-center mx-auto mb-8 md:mb-10 px-3 md:px-0">   
    <label for="voice-search" class="sr-only">Search</label>
    <div class="relative w-full flex items-center justify-stretch">
        <label for="search-dropdown" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>

        <button 
        data-dropdown-toggle="dropdown" 
          class="shrink-0 w-auto md:w-32 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          @click="showDropdown = !showDropdown"
          type="button"
        >
          {{ selectedCategory }}
          <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
        </button>
        <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-auto md:w-32 dark:bg-gray-700">
            <ul v-if="true" class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
              <li v-for="cat in categories" :key="cat">
                <button
                  @click="selectCategory(cat)"
                  class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {{ cat }}
                </button>
              </li>
            </ul>
        </div>
        <input @focus="showHistory = true" @blur="hideHistory" v-model="searchQuery" @keyup.enter="updateQuery" type="text" id="voice-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg block w-full ps-8 p-2.5  focus:bg-gray-50 focus:ring-blue-200 focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-700 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="جستجوی کلمه, آیه, معنی ..." required/>
        <ul v-if="showHistory && searchHistory.length" class="absolute left-0 right-0 border border-gray-300 mt-1 rounded shadow z-10 max-h-60 overflow-y-auto bg-white">
          <li
            v-for="item in searchHistory"
            :key="item"
            @mousedown.prevent="selectHistory(item)" 
            class="px-4 py-2 hover:bg-gray-400 cursor-pointer"
          >
            {{ item }}
          </li>
        </ul>
        <button @click="startListening" type="button" class="absolute inset-y-0 end-0 flex items-center pe-3">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" >
                <use href="#microphone"></use>
            </svg>
        </button>
        
    </div>
  </form>

  <div class="px-4 md:px-0">
    <div v-if="!loading" class="flex items-center justify-between">
      <p id="resultsCount" class="text-accent my-4">
        {{ startItem }} - {{ endItem }} از {{ count }}
      </p>
      <button  class="md:hidden text-xs text-blue-500" @click.prevent="toggleShowAll"> {{ showAll ? 'نمایش کوتاه' : 'نمایش کامل' }}</button>
    </div>


    <ol class="relative border-s border-gray-200 dark:border-gray-700 mb-10">                  
        <li v-if="loading" v-for="i in 8" :key="i" class="mb-10 ms-4">
          <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
          <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-3"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        </li>

        <li v-else-if="!loading && results.length === 0" class="text-gray-500 flex items-center justify-center gap-2">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400"><use href="#magnifying-glass"></use></svg>
          <span>نتیجه‌ای پیدا نشد.</span>
        </li>
        <li v-else v-for="verse in results" :key="verse.id"  class="mb-10 ms-4">
            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">آیه {{ verse.verse_number }} : {{ verse.surah }} / صفحه {{ verse.PageNum }}</time>
            <h3  @click="goToVerse(verse)" :class="['text-lg text-gray-900 dark:text-white cursor-pointer', !verse.showAll ? 'truncate w-full block sm:overflow-visible sm:whitespace-normal' : 'block']" v-html="verse.highlighted_AE2"></h3>
            <p :class="[ 'mb-4 text-base font-normal text-gray-500 dark:text-gray-400', !verse.showAll ? 'truncate w-full block sm:overflow-visible sm:whitespace-normal' : 'block']">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p>
        </li>
    </ol>

    <nav v-if="!loading" aria-label="Page navigation example" style="display: flex;">
      <ul class="inline-flex -space-x-px text-base h-10 mx-auto">
        <li >
          <a @click="changePage(1)" class="flex items-center justify-center px-3 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg class="w-3.5 h-3.5 me-2 rtl:rotate-180">
              <use href="#chevron-double-left"></use>
            </svg>
          </a>
        </li>
        <li :class="{ disabled: currentPage === 1 }">
          <a @click="changePage(currentPage-1)" class="flex items-center justify-center px-2 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180">
              <use href="#chevron-left"></use>
            </svg>
          </a>
        </li>

        <li v-for="page in pagesToShow" :key="page">
          <a @click="page !== '...' && changePage(page)" :class="{ 'active-btn': page === currentPage, 'dots-btn': page === '...' }" class="flex items-center justify-center px-3 h-10 cursor-pointer leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{{ page }}</a>
        </li>

        <li :class="{ disabled: currentPage === totalPages }">
          <a @click="changePage(currentPage+1)" class="flex items-center justify-center px-2 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180">
              <use href="#chevron-right"></use>
            </svg>
          </a>
        </li>
        <li :class="{ disabled: currentPage === totalPages }">
          <a @click="changePage(totalPages)" class="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180">
              <use href="#chevron-double-right"></use>
            </svg>
          </a>
        </li>
      </ul>
    </nav>

    <div v-if="!loading" class="text-center text-gray-500 dark:text-gray-400 mt-2">
      صفحه {{ currentPage }} از {{ totalPages }}
    </div>
  </div>

</div>


</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

// --- متغیرها ---
const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.query || '')
const results = ref([])
const count = ref(0)
const nextPage = ref(null)
const prevPage = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)
const searchHistory = ref([])
const showHistory = ref(false)

// --- debounce helper ---
function debounce(fn, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const hideHistory = () => {
  setTimeout(() => {
    showHistory.value = false
  }, 500)
}

const categories = ['ترجمه', 'قرآن']
const selectedCategory = ref('قرآن')  // پیش‌فرض قرآن

const selectCategory = (cat) => {
  selectedCategory.value = cat
}

const showAll = ref(false)

// تابع برای toggle کردن همه متن ها
const toggleShowAll = () => {
  showAll.value = !showAll.value
}

// --- API ---
const fetchResults = async (page = 1) => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/v1/quran/verses/', {
      params: { search: searchQuery.value, page }
    })
    results.value = res.data.results.map(v => ({
      ...v,
      highlighted_A: v.highlighted_A || v.SearchA || v.SearchAE
    }))
    count.value = res.data.count
    nextPage.value = res.data.next
    prevPage.value = res.data.previous
    currentPage.value = page
  } catch (e) {
    results.value = []
    count.value = 0
  } finally {
    loading.value = false
  }
}

// --- URL & search ---
const updateQuery = () => {
  if (!searchQuery.value || !searchQuery.value.trim()) return
  router.push({ path: '/search', query: { query: searchQuery.value } })
  fetchResults(1)
}

const updateQuerys = () => {
  if (!searchQuery.value || !searchQuery.value.trim()) return
  if (!searchHistory.value.includes(searchQuery.value)) {
    searchHistory.value.unshift(searchQuery.value)
    if (searchHistory.value.length > 10) searchHistory.value.pop()
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }
  fetchResults(1)
}


const selectHistory = (item) => {
  searchQuery.value = item
  updateQuery()
}

const debouncedSearch = debounce(updateQuery, 500)
watch(searchQuery, debouncedSearch)

const goToVerse = (verse) => {
  router.push({
    name: 'quran-surah',
    params: { surahno: verse.surah },
    query: { aya: verse.verse_number }
  })
}

// --- pagination ---
const startItem = computed(() => (results.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1))
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, count.value))
const totalPages = computed(() => Math.ceil(count.value / itemsPerPage))

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchResults(page)
}

const pagesToShow = computed(() => {
  const pages = []
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    if (currentPage.value <= 4) pages.push(...[1,2,3,4,5,'...',totalPages.value])
    else if (currentPage.value >= totalPages.value - 3) pages.push(...[1,'...',totalPages.value-4,totalPages.value-3,totalPages.value-2,totalPages.value-1,totalPages.value])
    else pages.push(...[1,'...',currentPage.value-1,currentPage.value,currentPage.value+1,'...',totalPages.value])
  }
  return pages
})

// --- Speech Recognition ---
let recognition
const startListening = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('مرورگر شما از Speech Recognition پشتیبانی نمی‌کند.')
    return
  }
  recognition = new webkitSpeechRecognition()
  recognition.lang = 'fa-IR'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.onresult = (event) => {
    searchQuery.value = event.results[0][0].transcript
    updateQuery()
  }
  recognition.start()
}

// --- mounted ---
onMounted(() => {
  if (searchQuery.value) fetchResults(1)
  const saved = localStorage.getItem('searchHistory')
  if (saved) searchHistory.value = JSON.parse(saved)
})

// --- watch URL ---
watch(() => route.query.query, (newQuery) => {
  searchQuery.value = newQuery || ''
  fetchResults(1)
})
</script>

<style >
/* :root {
  --bg-dark: #1a1a1a;
  --bg-dark-light: #242424;
  --text-light: #f0f0f0;
  --text-muted: #bbbbbb;
  --text-accent: #00bcd4;
  --border-color: #333333;
  --accent: #00bcd4;
} */

.highlight{
  color: var(--accent);
}

.page-content {
  background-color: var(--bg-dark);
  min-height: 300px;
  border-radius: 1rem;
}

.search-input {
  background: var(--bg-dark-light);
  color: var(--text-light);
  border: 1px solid var(--border-color);
  padding-left: 2.5rem;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}
.search-input::placeholder { color: #aaa; opacity: 1; }
.search-input:focus {
  background: var(--bg-dark);
  box-shadow: 0 0 20px var(--accent);
  border-color: var(--accent);
  color: var(--text-light);
}
.search-icon {
  color: var(--accent);
  font-size: 1.3rem;
  transition: transform 0.3s ease, color 0.3s ease;
}
.search-input:focus + .search-icon { transform: scale(1.1); color: var(--text-accent); }

.result-card {
  background-color: var(--bg-dark-light);
  border-left: 4px solid var(--accent);
  display: flow;
  align-items: center; /* وسط چین عمودی */
  gap: 0.5rem;
}

.verse-text {
  line-height: 1.6;
  font-size: 1.2rem;
}

.hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-scale:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.5); }

.page-btn {
  background: var(--bg-dark-light);
  color: var(--text-light);
  border: 1px solid var(--border-color);
  margin: 0 2px;
  transition: all 0.2s ease;
}
/* دکمه های disabled */
.page-item.disabled .page-link {
  background-color: var(--bg-dark-light) !important;
  color: var(--text-muted) !important;
  border: 1px solid var(--border-color);
  cursor: not-allowed;
  box-shadow: none;
}

.page-btn:hover { background: var(--accent); color: #fff; }
.active-btn { background: var(--accent); color: #4e4e4eff; border: none; }
.dots-btn { cursor: default; background: transparent; border: none; color: var(--text-muted); }

.text-accent { color: #7c7c7cff; }


</style>
