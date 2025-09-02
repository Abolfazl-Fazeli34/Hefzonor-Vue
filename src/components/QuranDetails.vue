<template>
  <!-- کنترلر بالای کادر اصلی -->
  <div class="text-light p-3 rounded mt-4 d-flex flex-wrap gap-3 align-items-center justify-content-between" style="max-width: 310px;margin: 0 auto;background-color: var(--bg-dark);" dir="rtl">
    <!-- انتخاب سوره -->
    <div class="form-group mb-0 flex-fill">
      <label for="surahSelect" class="form-label">انتخاب سوره:</label>
      <select id="surahSelect"
              v-model="selectedSurah"
              @change="generateAyahs"
              class="form-select text-light border border-secondary custom-offcanvas"
              style="background-color: var(--bg-dark);width: 135px;">
        <option value="" disabled>انتخاب کنید</option>
        <option v-for="surah in surahs" :key="surah.id" :value="surah.id">
          {{ surah.name }} ({{ surah.id }})
        </option>
      </select>
    </div>

    <!-- انتخاب آیه -->
    <div class="form-group mb-0 flex-fill">
      <label for="ayahSelect" class="form-label">انتخاب آیه:</label>
      <select id="ayahSelect"
              v-model="selectedAyah"
              class="form-select text-light border border-secondary custom-offcanvas" 
              style="background-color: var(--bg-dark);">
        <option value="" disabled>انتخاب کنید</option>
        <option v-for="ayah in ayahs" :key="ayah.id" :value="ayah.id">
          {{ ayah.name }}
        </option>
      </select>
    </div>
  </div>

  <div class="page-content container-fluid mt-4  p-4 rounded" style="margin-bottom: 100px;">
    <div class="d-flex h-100" style="min-height: 1400px;">
      <!-- ستون کناری -->
      <div class="d-flex flex-column me-3" style="width: 25%;">
        <!-- کادر پایین (نمایش آیه و اطلاعات) -->
        <div class="section-box flex-fill p-3" style="direction: rtl;">
          <div class="mb-3 border rounded p-3 shadow-sm verse-box" style="position: fixed;width: 365px;">
            <h5 class="mb-2 text-green fw-bold">۱. آیه 1 سوره نساء</h5>

            <div class="row">
              <div class="col-md-6 mb-2"><strong>سوره:</strong> سوره نساء (۴)</div>
              <div class="col-md-6 mb-2"><strong>جزء:</strong> ۴</div>
              <div class="col-md-6 mb-2"><strong>محل نزول:</strong> مدینه</div>
              <div class="col-md-6 mb-2"><strong>نوع قرائت:</strong> ترتیل</div>
            </div>

            <div class="mt-3">
              <h6 class="text-accent">متن ترتیل</h6>
              <p class="fs-5" style="line-height: 2;">
                يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ مِّن نَّفْسٍ وَاحِدَةٍ ...
              </p>
            </div>

            <div class="mt-3">
              <h6 style="color: var(--text-accent);">ترجمه (مکارم شیرازی)</h6>
              <p>
                ای مردم! از (مخالفت) پروردگارتان بپرهیزید؛ همان کسی که همه شما را از یک انسان آفرید...
              </p>
            </div>

            <div class="mt-3">
              <h6 class="text-accent">فایل‌های صوتی</h6>
              <audio controls class="w-100 mb-2">
                <source src="https://example.com/audio1.mp3" type="audio/mp3">
              </audio>
              <audio controls class="w-100">
                <source src="https://example.com/audio2.mp3" type="audio/mp3">
              </audio>
            </div>
          </div>
        </div>
      </div>

      <!-- محتوای اصلی -->
      <div class="flex-grow-1 d-flex flex-column section-box content-box">
        <div class="mb-3 border rounded p-3 shadow-sm verse-box">


        <!-- آیه
        <div class="text-center verse-text mb-3">
          ﴿﴾
        </div> -->
        <!-- آیه -->
        <div class="text-center verse-text mb-3">
          ﴿ {{ verseText || 'لطفاً یک آیه انتخاب کنید' }} ﴾
        </div>


        <!-- معنی -->
        <div class="text-center verse-meaning mb-4">
          <li v-for="(line, idx) in translations[activeTab]?.translations" :key="idx">
              {{ line }}
          </li>
        </div>

        <div class="translation-box border-green">
          <h5 class="section-title text-green">ترجمه‌های فارسی</h5>

          <!-- تب‌ها (مترجمان) -->
          <ul class="nav nav-tabs mb-3">
            <li v-for="(translator, index) in translations" :key="translator.id" class="nav-item">
              <button
                class="nav-link"
                :class="{ active: activeTab === index }"
                @click="activeTab = index"
              >
                {{ translator.name }}
              </button>
            </li>
          </ul>

          <!-- نمایش ترجمه انتخاب شده -->
          <div class="translation-content" v-if="translations.length > 0">
            <ul class="list-unstyled">
              <li v-for="(line, idx) in translations[activeTab]?.translations" :key="idx">
                {{ line }}
              </li>
            </ul>
          </div>
          <div v-else>
            <p class="text-muted">ترجمه‌ای برای این آیه یافت نشد</p>
          </div>
        </div>
        
        <div class="translation-box border-green" dir="ltr" v-if="translationsEn.length > 0">
          <h5 class="section-title text-green">English Translations</h5>

          <!-- تب‌ها (مترجمان) -->
          <ul class="nav nav-tabs mb-3" style="padding-left: 0px;">
            <li
              v-for="(translator, index) in translationsEn"
              :key="translator.id"
              class="nav-item"
            >
              <button
                class="nav-link"
                :class="{ active: activeTabEn === index }"
                @click="activeTabEn = index"
              >
                {{ translator.name }}
              </button>
            </li>
          </ul>

          <!-- نمایش ترجمه انتخاب شده -->
          <div class="translation-content">
            <ul class="list-unstyled" style="padding-left: 0px;">
              <li v-for="(line, idx) in translationsEn[activeTabEn].translations" :key="idx">
                {{ line }}
              </li>
            </ul>
          </div>
        </div>

        <div class="translation-box border-red" dir="rtl" v-if="translationsTable.length > 0">
          <h5 class="section-title text-red">معانی کلمات آیه</h5>

          <!-- تب‌ها (مترجمان) -->
          <ul class="nav nav-tabs mb-3">
            <li
              v-for="(translator, index) in translationsTable"
              :key="translator.id"
              class="nav-item"
            >
              <button
                class="nav-link"
                :class="{ active: activeTabTable === index }"
                @click="activeTabTable = index"
              >
                {{ translator.name }}
              </button>
            </li>
          </ul>

          <!-- جدول معانی مترجم انتخاب‌شده -->
          <table class="table table-sm table-bordered text-light rounded overflow-hidden custom-dark-table">
            <thead class="text-center">
              <tr>
                <th style="background-color: var(--bg-dark);" class="text-light">کلمه</th>
                <th style="background-color: var(--bg-dark);" class="text-light">معنی</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in translationsTable[activeTabTable].words" :key="idx">
                <td>{{ item.word }}</td>
                <td>{{ item.meaning }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="translation-box border-purple" dir="rtl" v-if="tafseerTranslations.length > 0" style="max-width: 1120px;">
          <h5 class="section-title text-purple">تفسیر آیه</h5>

          <!-- تب‌ها -->
          <ul class="nav nav-tabs mb-3">
            <li
              v-for="(tafseer, index) in tafseerTranslations"
              :key="tafseer.id"
              class="nav-item"
            >
              <button
                class="nav-link"
                :class="{ active: activeInterpretationTab === index }"
                @click="activeInterpretationTab = index"
              >
                {{ tafseer.name }}
              </button>
            </li>
          </ul>

          <!-- متن تفسیر انتخاب شده -->
          <p class="text-light" style="min-height: 100px;">
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


<style scoped>
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

</style>
