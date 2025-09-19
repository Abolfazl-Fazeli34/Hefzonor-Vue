<template>
  <!-- کنترلر بالای کادر اصلی -->
  <div class="text-light p-3 rounded mt-4 flex flex-wrap gap-3 items-center justify-between max-w-[310px] mx-auto bg-[#1a1a1a]" dir="rtl">
    <!-- انتخاب سوره -->
    <div class="flex-1 mb-0">
      <label for="surahSelect" class="block mb-1">انتخاب سوره:</label>
      <select id="surahSelect"
              v-model="selectedSurah"
              @change="generateAyahs"
              class="w-[135px] text-white border border-gray-600 rounded bg-[#1a1a1a] p-1">
        <option value="" disabled>انتخاب کنید</option>
        <option v-for="surah in surahs" :key="surah.id" :value="surah.id">
          {{ surah.name }} ({{ surah.id }})
        </option>
      </select>
    </div>

    <!-- انتخاب آیه -->
    <div class="flex-1 mb-0">
      <label for="ayahSelect" class="block mb-1">انتخاب آیه:</label>
      <select id="ayahSelect"
              v-model="selectedAyah"
              class="w-full text-white border border-gray-600 rounded bg-[#1a1a1a] p-1">
        <option value="" disabled>انتخاب کنید</option>
        <option v-for="ayah in ayahs" :key="ayah.id" :value="ayah.id">
          {{ ayah.name }}
        </option>
      </select>
    </div>
  </div>

  <!-- محتوا -->
  <div class="page-content container mx-auto mt-4 p-4 rounded-b-[2rem] mb-24 bg-[#1a1a1a] text-white">
    <div class="flex h-full min-h-[1400px]">
      
      <!-- ستون کناری -->
      <div class="flex flex-col mr-3 w-1/4">
        <!-- کادر پایین (نمایش آیه و اطلاعات) -->
        <div class="section-box flex-1 p-3" dir="rtl">
          <div class="verse-box border border-gray-700 p-3 rounded shadow-md fixed w-[365px]">
            <h5 class="mb-2 text-green-500 font-bold">۱. آیه 1 سوره نساء</h5>
            <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div><strong>سوره:</strong> سوره نساء (۴)</div>
              <div><strong>جزء:</strong> ۴</div>
              <div><strong>محل نزول:</strong> مدینه</div>
              <div><strong>نوع قرائت:</strong> ترتیل</div>
            </div>

            <div class="mt-3">
              <h6 class="text-cyan-400">متن ترتیل</h6>
              <p class="text-lg leading-loose">
                يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ مِّن نَّفْسٍ وَاحِدَةٍ ...
              </p>
            </div>

            <div class="mt-3">
              <h6 class="text-cyan-400">ترجمه (مکارم شیرازی)</h6>
              <p>ای مردم! از (مخالفت) پروردگارتان بپرهیزید؛ همان کسی که همه شما را از یک انسان آفرید...</p>
            </div>

            <div class="mt-3">
              <h6 class="text-cyan-400">فایل‌های صوتی</h6>
              <audio controls class="w-full mb-2">
                <source src="https://example.com/audio1.mp3" type="audio/mp3">
              </audio>
              <audio controls class="w-full">
                <source src="https://example.com/audio2.mp3" type="audio/mp3">
              </audio>
            </div>
          </div>
        </div>
      </div>

      <!-- محتوای اصلی -->
      <div class="flex-1 flex flex-col section-box content-box">
        <div class="verse-box border border-gray-700 p-3 rounded shadow-md w-full max-w-[1198px] mx-auto">
          
          <!-- آیه -->
          <div class="text-center text-3xl font-bold leading-loose mb-3" style="font-family: 'Amiri', 'Scheherazade New', serif;">
            ﴿ {{ verseText || 'لطفاً یک آیه انتخاب کنید' }} ﴾
          </div>

          <!-- معنی -->
          <div class="text-center text-cyan-400 mb-4">
            <li v-for="(line, idx) in translations[activeTab]?.translations" :key="idx">
                {{ line }}
            </li>
          </div>

          <!-- ترجمه‌های فارسی -->
          <div class="translation-box border border-green-500 rounded p-5 mb-6 bg-[#1a1a1a]">
            <h5 class="section-title text-green-500">ترجمه‌های فارسی</h5>
            <!-- تب‌ها -->
            <ul class="flex space-x-2 mb-3">
              <li v-for="(translator, index) in translations" :key="translator.id">
                <button
                  class="px-3 py-1 rounded"
                  :class="activeTab === index ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'"
                  @click="activeTab = index"
                >
                  {{ translator.name }}
                </button>
              </li>
            </ul>
            <div>
              <ul class="list-none">
                <li v-for="(line, idx) in translations[activeTab]?.translations" :key="idx">
                  {{ line }}
                </li>
              </ul>
            </div>
          </div>

          <!-- ترجمه انگلیسی -->
          <div class="translation-box border border-green-500 rounded p-5 mb-6 bg-[#1a1a1a]" dir="ltr" v-if="translationsEn.length">
            <h5 class="section-title text-green-500">English Translations</h5>
            <ul class="flex space-x-2 mb-3">
              <li v-for="(translator, index) in translationsEn" :key="translator.id">
                <button
                  class="px-3 py-1 rounded"
                  :class="activeTabEn === index ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'"
                  @click="activeTabEn = index"
                >
                  {{ translator.name }}
                </button>
              </li>
            </ul>
            <ul class="list-none">
              <li v-for="(line, idx) in translationsEn[activeTabEn]?.translations" :key="idx">
                {{ line }}
              </li>
            </ul>
          </div>

          <!-- معانی کلمات -->
          <div class="translation-box border border-red-500 rounded p-5 mb-6 bg-[#1a1a1a]" dir="rtl" v-if="translationsTable.length">
            <h5 class="section-title text-red-500">معانی کلمات آیه</h5>
            <ul class="flex space-x-2 mb-3">
              <li v-for="(translator, index) in translationsTable" :key="translator.id">
                <button
                  class="px-3 py-1 rounded"
                  :class="activeTabTable === index ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'"
                  @click="activeTabTable = index"
                >
                  {{ translator.name }}
                </button>
              </li>
            </ul>
            <table class="table-auto w-full text-center border border-gray-700 rounded overflow-hidden">
              <thead class="bg-gray-900 text-white">
                <tr>
                  <th class="border border-gray-700 px-2 py-1">کلمه</th>
                  <th class="border border-gray-700 px-2 py-1">معنی</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in translationsTable[activeTabTable]?.words" :key="idx" class="hover:bg-gray-800">
                  <td class="border border-gray-700 px-2 py-1">{{ item.word }}</td>
                  <td class="border border-gray-700 px-2 py-1">{{ item.meaning }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- تفسیر -->
          <div class="translation-box border border-purple-500 rounded p-5 mb-6 bg-[#1a1a1a]" dir="rtl" v-if="tafseerTranslations.length">
            <h5 class="section-title text-purple-500">تفسیر آیه</h5>
            <ul class="flex space-x-2 mb-3">
              <li v-for="(tafseer, index) in tafseerTranslations" :key="tafseer.id">
                <button
                  class="px-3 py-1 rounded"
                  :class="activeInterpretationTab === index ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'"
                  @click="activeInterpretationTab = index"
                >
                  {{ tafseer.name }}
                </button>
              </li>
            </ul>
            <p class="text-white min-h-[100px]">
              {{ tafseerTranslations[activeInterpretationTab]?.text || 'تفسیر یافت نشد' }}
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const props = defineProps({
  surahno: { type: Number, default: null },
  verse_number: { type: Number, default: null },
  id_sure: { type: Number, default: null },
  filteredItems: { type: Array, default: () => [] },
  selectedWord: { type: String, default: '' }
})

const emit = defineEmits(['sendAudioData', 'wordClicked'])

function onWordClick(word) {
  emit('wordClicked', word)
}

// داده‌ها
const surahs = ref([])
const ayahs = ref([])
const selectedSurah = ref(null)
const selectedAyah = ref(null)
const verseText = ref('')

// ترجمه‌ها (فارسی)
const translators = ref([])
const translations = ref([])
const activeTab = ref(0)
const isFetchingTranslations = ref(false)

// ترجمه‌ها (انگلیسی)
const translatorsEn = ref([])
const translationsEn = ref([])
const activeTabEn = ref(0)
const isFetchingTranslationsEn = ref(false)

// معانی کلمات
const translatorsTable = ref([])
const translationsTable = ref([])
const activeTabTable = ref(0)
const isFetchingWordMeanings = ref(false)

// تفاسیر
const tafseerTranslators = ref([])
const tafseerTranslations = ref([])
const activeInterpretationTab = ref(0)

// گرفتن پارامترها
const surahno = route.params.surahno || props.surahno
const verse_number = route.params.verse_number || props.verse_number

// ✅ دریافت لیست سوره‌ها
onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:8000/api/v1/quran/surah/verse/list/?type=surah')
    surahs.value = data

    if (surahno) {
      selectedSurah.value = parseInt(surahno)
      generateAyahs()
    }

    await fetchTranslatorsFa()
    await fetchTranslatorsEn()
    await fetchTranslatorsTable()
    await fetchTafseerTranslators()
  } catch (error) {
    console.error("خطا در دریافت سوره‌ها:", error)
  }

})

// ✅ ساخت لیست آیات
function generateAyahs() {
  const surah = surahs.value.find(s => s.id === parseInt(selectedSurah.value))
  if (surah) {
    ayahs.value = Array.from({ length: surah.verse_count }, (_, i) => ({
      id: i + 1,
      name: `آیه ${i + 1}`
    }))
    if (verse_number) {
      selectedAyah.value = parseInt(verse_number)
      fetchVerseText()
    }
  } else {
    ayahs.value = []
  }
}

// ✅ دریافت متن آیه
async function fetchVerseText() {
  if (!selectedSurah.value || !selectedAyah.value) return
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/quran/surahs/?id=${selectedSurah.value}&verse_number=${selectedAyah.value}`
    )

    const results = data.results?.[0]?.verses?.results || []
    const firstVerse = results[0]?.verses?.[0]?.text?.full_tashkeel || ''
    verseText.value = firstVerse

    if (translators.value.length > 0) await fetchTranslationsFa()
    if (translatorsEn.value.length > 0) await fetchTranslationsEn()
    if (translatorsTable.value.length > 0) await fetchTranslationsTable()
    if (tafseerTranslators.value.length > 0) await fetchTafseerTranslations()
  } catch (error) {
    console.error(" خطا در دریافت آیه:", error)
  }
}

// ✅ مترجمان فارسی
async function fetchTranslatorsFa() {
  try {
    const { data } = await axios.get(
      'http://localhost:8000/api/v1/quran/translator/?language=fa&translation_type=verse'
    )
    translators.value = data
  } catch (error) {
    console.error(" خطا در دریافت مترجمان فارسی:", error)
  }
}

// ✅ مترجمان انگلیسی
async function fetchTranslatorsEn() {
  try {
    const { data } = await axios.get(
      'http://localhost:8000/api/v1/quran/translator/?language=en&translation_type=verse'
    )
    translatorsEn.value = data
  } catch (error) {
    console.error(" خطا در دریافت مترجمان انگلیسی:", error)
  }
}

// ✅ مترجمان معنی کلمات
async function fetchTranslatorsTable() {
  try {
    const { data } = await axios.get(
      'http://localhost:8000/api/v1/quran/translator/?language=fa&translation_type=word'
    )
    translatorsTable.value = data
  } catch (error) {
    console.error(" خطا در دریافت مترجمان معانی کلمات:", error)
  }
}

// ✅ ترجمه‌های فارسی
async function fetchTranslationsFa() {
  if (!selectedSurah.value || !selectedAyah.value || translators.value.length === 0) return
  if (isFetchingTranslations.value) return
  isFetchingTranslations.value = true

  translations.value = []

  for (let translator of translators.value) {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/quran/verse/translation/?surah=${selectedSurah.value}&verse=${selectedAyah.value}&translator=${translator.id}`
      )
      const lines = data.results?.map(item => item.text) || []

      translations.value.push({
        id: translator.id,
        name: translator.name,
        translations: lines.length > 0 ? lines : ['ترجمه‌ای یافت نشد']
      })
    } catch (error) {
      console.error(` خطا در ترجمه فارسی ${translator.name}:`, error)
    }
  }

  if (translations.value.length > 0) activeTab.value = 0
  isFetchingTranslations.value = false
}

// ✅ ترجمه‌های انگلیسی
async function fetchTranslationsEn() {
  if (!selectedSurah.value || !selectedAyah.value || translatorsEn.value.length === 0) return
  if (isFetchingTranslationsEn.value) return
  isFetchingTranslationsEn.value = true

  translationsEn.value = []

  for (let translator of translatorsEn.value) {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/quran/verse/translation/?surah=${selectedSurah.value}&verse=${selectedAyah.value}&translator=${translator.id}`
      )
      const lines = data.results?.map(item => item.text) || []

      translationsEn.value.push({
        id: translator.id,
        name: translator.name,
        translations: lines.length > 0 ? lines : ['Translation not found']
      })
    } catch (error) {
      console.error(`Error fetching English translation (${translator.name}):`, error)
    }
  }

  if (translationsEn.value.length > 0) activeTabEn.value = 0
  isFetchingTranslationsEn.value = false
}

// ✅ ترجمه‌های معانی کلمات
async function fetchTranslationsTable() {
  if (!selectedSurah.value || !selectedAyah.value || translatorsTable.value.length === 0) return
  if (isFetchingWordMeanings.value) return
  isFetchingWordMeanings.value = true

  translationsTable.value = []

  for (let translator of translatorsTable.value) {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/quran/word/meaning/?surah=${selectedSurah.value}&verse=${selectedAyah.value}&translator=${translator.id}&root_id=`
      )

      let wordsList = []

      if (data.results && data.results.length > 0) {
        const validResult = data.results.find(item => item.meanings && item.meanings.trim() !== '')
        if (validResult) {
          let meaningsStr = validResult.meanings
            .replace(/}{/g, '،')
            .replace(/\s+/g, ' ')
            .trim()

          let seen = new Set()
          meaningsStr.split(/،|,/).forEach(part => {
            const cleaned = part.trim()
            const eqIndex = cleaned.indexOf('=')
            if (eqIndex !== -1) {
              const word = cleaned.slice(0, eqIndex).trim().replace(/^[^آ-یa-zA-Z0-9]+|[^آ-یa-zA-Z0-9]+$/g, '')
              const meaning = cleaned.slice(eqIndex + 1).trim()
              if (word && meaning) {
                const entry = word + '=' + meaning
                if (!seen.has(entry)) {
                  seen.add(entry)
                  wordsList.push({ word, meaning })
                }
              }
            }
          })
        }
      }

      translationsTable.value.push({
        id: translator.id,
        name: translator.name,
        words: wordsList.length > 0 ? wordsList : [{ word: '-', meaning: 'معنی یافت نشد' }]
      })
    } catch (error) {
      console.error(` خطا در معنی کلمات (${translator.name}):`, error)
    }
  }

  if (translationsTable.value.length > 0) activeTabTable.value = 0
  isFetchingWordMeanings.value = false
}

// ✅ لیست مفسران
async function fetchTafseerTranslators() {
  try {
    const { data } = await axios.get(
      'http://localhost:8000/api/v1/quran/translator/?language=fa&translation_type=tafseer'
    )
    tafseerTranslators.value = data
  } catch (error) {
    console.error(" خطا در دریافت لیست مفسران:", error)
  }
}

// ✅ ترجمه‌های تفسیر
async function fetchTafseerTranslations() {
  if (!selectedSurah.value || !selectedAyah.value || tafseerTranslators.value.length === 0) return

  tafseerTranslations.value = []

  for (let translator of tafseerTranslators.value) {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/quran/tafseer/?translator=${translator.id}&surah=${selectedSurah.value}&from_aya=${selectedAyah.value}&to_aya=${selectedAyah.value}`
      )

      const tafseerText = data.results?.[0]?.text || 'تفسیر یافت نشد'

      tafseerTranslations.value.push({
        id: translator.id,
        name: translator.name,
        text: tafseerText
      })
    } catch (error) {
      console.error(` خطا در دریافت تفسیر ${translator.name}:`, error)
    }
  }

  if (tafseerTranslations.value.length > 0) activeInterpretationTab.value = 0
}

// ✅ واکنش به تغییرات
watch(selectedSurah, () => {
  if (!selectedSurah.value) return
  generateAyahs()
  verseText.value = ''
  translations.value = []
  translationsEn.value = []
  translationsTable.value = []
  tafseerTranslations.value = []
})

watch(selectedAyah, () => {
  if (selectedAyah.value) fetchVerseText()
})
</script>


<!-- <style scoped>
:root {
  --bg-dark: #1a1a1a;
  --bg-dark-light: #242424;
  --text-light: #f0f0f0;
  --text-muted: #bbbbbb;
  --text-accent: #00bcd4;
  --border-color: #333333;
  --green: #4caf50;
  --red: #f44336;
  --purple: #b48bf2;
}

/* body {
  background-color: #000;
  color: var(--text-light);
} */

.page-content {
  background-color: var(--bg-dark);
  color: var(--text-light);
  min-height: 100vh;
  overflow-y: auto;
  width: 90%;
  border-radius: 1rem;
  /* margin-bottom: 8rem; */
}

/* اسکرول فقط برای کل صفحه */
body, html {
  overflow-y: auto;
  height: 100%;
  margin: 0;
}

/* باکس‌ها */
.section-box {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1rem;
  color: var(--text-light);
}

.verse-box {
  /* background-color: var(--bg-dark-light);
   */
  background-color: var(--bg-dark);
  border: 1px solid var(--border-color);
  color: var(--text-light);
}

/* آیه */
.verse-text {
  font-size: 2.3rem;
  font-weight: bold;
  font-family: 'Amiri', 'Scheherazade New', serif;
  direction: rtl;
  line-height: 2;
}

/* معنی */
.verse-meaning {
  font-size: 1.2rem;
  color: var(--text-accent);
  direction: rtl;
}

/* ترجمه‌ها */
.translation-box {
  background-color: rgba(255, 255, 255, 0.025);
  border: 1px solid;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

/* عنوان‌ها */
.section-title {
  font-size: 1.05rem;
  font-weight: bold;
  padding-bottom: 0.4rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid currentColor;
}

/* رنگ‌ها */
.text-accent {
  color: var(--text-accent);
}
.border-accent {
  border-color: var(--text-accent);
}

.text-green {
  color: var(--green);
}
.border-green {
  border-color: var(--green);
}

.text-red {
  color: var(--red);
}
.border-red {
  border-color: var(--red);
}

.text-purple {
  color: var(--purple);
}
.border-purple {
  border-color: var(--purple);
}


.custom-dark-table {
  background-color: var(--bg-dark);
  border-color: var(--border-color);
  color: var(--text-light);
}

.custom-dark-table thead {
  background-color: #222; /* رنگ کمی تیره‌تر برای هدر */
  color: var(--text-light);
}

.custom-dark-table thead th {
  border-color: var(--border-color);
  font-weight: 600;
  text-align: center;
}

.custom-dark-table tbody tr {
  border-color: var(--border-color);
  transition: background-color 0.3s ease;
}

.custom-dark-table tbody tr:hover {
  background-color: rgba(255 255 255 / 0.1); /* افکت هاور ملایم */
}

.custom-dark-table tbody td {
  background-color: var(--bg-dark);
  border-color: var(--border-color);
  color: var(--text-light);
  padding: 0.5rem 1rem;
  vertical-align: middle;
}

/* اسکرول سفارشی */
.custom-offcanvas::-webkit-scrollbar {
  width: 6px;
}
.custom-offcanvas::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

</style> -->
