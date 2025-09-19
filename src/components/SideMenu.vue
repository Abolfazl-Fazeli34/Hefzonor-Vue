<template>
  <!-- drawer component -->
  <div 
    id="drawer-navigation"
    class="fixed top-0 right-0 z-40 w-64 md:w-72 h-screen p-4 overflow-hidden bg-white dark:bg-gray-800 transform transition-transform duration-300"
    :class="drawerOpen ? 'translate-x-0' : 'translate-x-full'"
    tabindex="-1"
    aria-labelledby="drawer-navigation-label"
  >
    <h5 id="drawer-navigation-label" class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
      لیست قرآن
    </h5>

    <!-- Close button -->
    <button type="button" @click="toggleDrawer" 
      class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-600 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
      <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <use href="#x-mark"></use>
        </svg>
      <span class="sr-only">Close menu</span>
    </button>

    <!-- Content -->
    <div class="py-4 overflow-y-auto">
      <!-- Tabs -->
      <ul class="flex text-sm font-medium text-center border border-gray-400 overflow-hidden dark:border-gray-600 text-gray-500 rounded-lg shadow-sm">
        <li class="w-full">
          <button @click="goPage('surah')" :class="tabClass('surah')">سوره</button>
        </li>
        <li class="w-full border-x border-gray-400 dark:border-gray-600">
          <button @click="goPage('page')" :class="tabClass('page')">صفحه</button>
        </li>
        <li class="w-full">
          <button @click="goPage('juz')" :class="tabClass('juz')">جزء</button>
        </li>
      </ul>

      <!-- Search -->
      <form class="flex items-center max-w-lg mx-auto mt-3" @submit.prevent="goPage(activeType)">
        <div class="relative w-full">
          <input 
            type="text" 
            v-model="searchQuery" 
            class="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg 
                  focus:ring-blue-400 focus:border-blue-400 block w-full p-2.5 
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                  dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400" 
            placeholder="جستجوی سوره / صفحه / جزء ..."
          />
          <button @click="startListening" data-tooltip-target="tooltip-Microphone" type="button" class="absolute inset-y-0 end-0 flex items-center pe-3">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <use href="#microphone"></use>
              </svg>
              <span class="sr-only">Microphone</span>
          </button>
          <div id="tooltip-Microphone" role="tooltip"class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
              میکروفن
              <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </form>

      <!-- Tabs Content -->
      <div class="mt-4">
        <!-- Surah -->
        <div v-show="activeType === 'surah'" 
            class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 h-[calc(100vh-150px)] overflow-y-auto custom-offcanvas">
          <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="group in groupedPairs" :key="group[0].surah_id" class="pb-3 sm:py-4 flex items-center justify-between">
              <div class="flex items-center flex-row-reverse gap-3">
                <div class="flex-1 min-w-0">
                  <p class="text-lg md:text-3xl font-medium text-gray-600 truncate dark:text-white QCF_BSML">
                    {{ group[0].code }}{{ group[1] ? group[1].code : '' }}
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-600 dark:text-white">
                  {{ group[0].surah_id }}
                </div>
              </div>
              <div class="text-gray-600 flex truncate dark:text-white gap-2">
                <p>{{ group[0].verse_count }}</p>
                <p>آیه</p>
              </div>
            </li>
            <li v-if="!groupedPairs.length" v-for="i in 114 " role="status" class="max-w-sm animate-pulse pb-3 sm:py-4">
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-2"></div>
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-52 mb-2"></div>
            </li>
          </ul>
        </div>


        <!-- Page -->
        <div v-show="activeType === 'page'" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 h-[calc(100vh-150px)] overflow-y-auto custom-offcanvas">
          <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="item in listPage" :key="item.page" class="pb-3 sm:py-4 flex items-center justify-between">
              <div class="flex items-center flex-row-reverse gap-3">
                <div class="flex-1 min-w-0">
                  <p class="text-sm md:text-lg font-medium text-gray-600 truncate dark:text-white">
                    {{ item.id }} {{ item.page }}
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-600 dark:text-white">
                  {{ item.page }}
                </div>
              </div>
              <div class="text-gray-600 flex truncate dark:text-white gap-2">
                  <p>{{ item.verse_count }}</p>
                  <p>آیه</p>
                </div>
            </li>
            <li v-if="!listPage.length" v-for="i in 604 " role="status" class="max-w-sm animate-pulse pb-3 sm:py-4">
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-2"></div>
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-52 mb-2"></div>
            </li>
          </ul>
        </div>

        <!-- Juz -->
        <div v-show="activeType === 'juz'" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 h-[calc(100vh-150px)] overflow-y-auto custom-offcanvas">
          <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="item in listJuz" :key="item.juz" class="pb-3 sm:py-4 flex items-center justify-between">
              <div class="flex items-center flex-row-reverse gap-3">
                <div class="flex-1 min-w-0">
                  <p class="text-sm md:text-lg font-medium text-gray-600 truncate dark:text-white">
                    {{ item.id }} {{ item.juz }}
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-600 dark:text-white">
                  {{ item.juz }}
                </div>
              </div>
              <div class="text-gray-600 flex truncate dark:text-white gap-2">
                <p>{{ item.verse_count }}</p>
                <p>آیه</p>
              </div>
            </li>
            <li v-if="!listJuz.length" v-for="i in 30 " role="status" class="max-w-sm animate-pulse pb-3 sm:py-4">
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-2"></div>
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-52 mb-2"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

// Vuex state
const store = useStore();
const drawerOpen = computed({
  get: () => store.state.isOpen,
  set: val => store.commit('setIsOpen', val)
});
const toggleDrawer = () => (drawerOpen.value = !drawerOpen.value);

// Active tab
const activeType = ref('surah');

// States
const listSurah = ref([]);
const listPage = ref([]);
const listJuz = ref([]);
const searchQuery = ref('');

// API call
const goPage = async (type) => {
  activeType.value = type;
  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/quran/surah/verse/list/`,
      { params: { type, search: searchQuery.value || '' } }
    );
    if (type === 'surah') listSurah.value = res.data;
    if (type === 'page') listPage.value = res.data;
    if (type === 'juz') listJuz.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

// Grouped pairs for surah
const groupedPairs = computed(() => {
  const result = [];
  for (let i = 0; i < listSurah.value.length; i += 2) {
    result.push([listSurah.value[i], listSurah.value[i + 1] || null]);
  }
  return result;
});

// Tab class
const tabClass = (type) =>
  `inline-block w-full p-2 ${
    activeType.value === type
      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white'
      : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'
  }`;

// --- جستجوی زنده (debounce)
let debounceTimer;
watch(searchQuery, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    goPage(activeType.value);
  }, 400);
});

// --- Speech Recognition
let recognition;
const startListening = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('مرورگر شما از Speech Recognition پشتیبانی نمی‌کند.');
    return;
  }

  recognition = new webkitSpeechRecognition(); // یا SpeechRecognition برای فایرفاکس
  recognition.lang = 'fa-IR'; // زبان فارسی
  recognition.interimResults = false; // فقط نتیجه نهایی
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchQuery.value = transcript; // قرار دادن صدا در فیلد جستجو
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.start();
};

// Initial load
onMounted(() => {
  goPage('surah');
});
</script>


<style scoped>
@font-face {
  font-family: 'QCF_BSML';
  src: url('/public/fonts/QCF_BSML.TTF');
}
.QCF_BSML {
  font-family: 'QCF_BSML', sans-serif;
}

.custom-offcanvas::-webkit-scrollbar {
  width: 10px;
}
.custom-offcanvas::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
} 

</style>