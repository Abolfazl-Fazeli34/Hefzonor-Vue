<template>
  <div class="container py-5 my-4 p-4 rounded page-content">
    <!-- نوار جستجو -->
    <div class="mb-4 position-relative">
      <input type="text" v-model="searchQuery"
       @keyup.enter="updateQuery"
       class="form-control form-control-lg rounded-pill ps-5 shadow-lg search-input"
       placeholder="جستجو">
      <i class="fas fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-4 search-icon"
        @click="updateQuery"></i>
    </div>

    <!-- تعداد نتایج -->
    <p id="resultsCount" class="text-accent mb-4">
      {{ startItem }} - {{ endItem }} از {{ count }} نتیجه جستجو
    </p>

    <!-- نتایج جستجو -->
    <ul id="resultsList" class="list-unstyled mb-5">
      <li v-for="verse in results" :key="verse.id" @click="goToVerse(verse)" style="cursor: pointer;" class="result-card p-3 mb-3 rounded shadow-sm hover-scale">
        <i class="fas fa-file-alt text-accent mt-1 me-2"></i>
        <span class="verse-text" v-html="verse.highlighted_AE2"></span>
        <span class="text-accent ms-2">
          (آیه {{ verse.verse_number }} : {{ verse.surah }}) (صفحه {{ verse.PageNum }})
        </span>
      </li>
    </ul>

<!-- شماره صفحات -->
<nav class="d-flex justify-content-center my-4" v-if="totalPages > 1">
  <ul class="pagination custom-pagination shadow-lg rounded-pill px-2 py-1">
    
    <!-- اولین صفحه -->
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <button class="page-link page-btn" @click="changePage(1)" title="اولین صفحه">
        «
      </button>
    </li>

    <!-- قبلی -->
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <button class="page-link page-btn" @click="changePage(currentPage-1)" title="صفحه قبل">
        ‹
      </button>
    </li>

    <!-- شماره صفحات -->
    <li v-for="page in pagesToShow" :key="page" class="page-item">
      <button
        class="page-link page-btn"
        :class="{ 'active-btn': page === currentPage, 'dots-btn': page === '...' }"
        @click="page !== '...' && changePage(page)"
      >
        {{ page }}
      </button>
    </li>

    <!-- بعدی -->
    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <button class="page-link page-btn" @click="changePage(currentPage+1)" title="صفحه بعد">
        ›
      </button>
    </li>

    <!-- آخرین صفحه -->
    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <button class="page-link page-btn" @click="changePage(totalPages)" title="آخرین صفحه">
        »
      </button>
    </li>
  </ul>
</nav>

<!-- نمایش وضعیت صفحه -->
<div class="text-center text-accent small">
  صفحه {{ currentPage }} از {{ totalPages }}
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

// --- debounce helper ---
function debounce(fn, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

// --- فراخوانی API ---
const fetchResults = async (page = 1) => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/quran/verses/', {
      params: { search: searchQuery.value, page: page }
    })

    // ساختار جدید API:
    results.value = response.data.results.map(v => ({
      ...v,
      highlighted_A: v.highlighted_A || v.SearchA || v.SearchAE
    }))

    count.value = response.data.count
    nextPage.value = response.data.next
    prevPage.value = response.data.previous
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching results:', error)
    results.value = []
    count.value = 0
    nextPage.value = null
    prevPage.value = null
  }
}

// --- بروزرسانی URL ---
const updateQuery = () => {
  router.push({ path: '/search', query: { query: searchQuery.value } })
  fetchResults(1)
}

const goToVerse = (verse) => {
  router.push({
    name: 'quran-surah',
    params: { surahno: verse.surah },
    query: { aya: verse.verse_number }
  })
}

// --- watch با debounce ---
const debouncedSearch = debounce(() => {
  updateQuery()
}, 500)  // ۵۰۰ میلی‌ثانیه بعد از توقف تایپ کاربر

watch(searchQuery, (newVal, oldVal) => {
  debouncedSearch()
})

// --- محاسبات pagination ---
const startItem = computed(() => (results.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1))
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, count.value))
const totalPages = computed(() => Math.ceil(count.value / itemsPerPage))

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchResults(page)
}

// محاسبه صفحات برای pagination
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

// بارگذاری اولیه
onMounted(() => {
  if (searchQuery.value) fetchResults(1)
})

// همگام سازی URL
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
