<template>
  <div class="my-4 p-4 rounded page-content" style="max-width: 1200px; margin: 0 auto;">
    <!-- تب‌ها -->
    <ul class="nav nav-tabs justify-content-center gap-2" id="tabExample" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link" :class="{ active: activeTab === 'tab1' }" @click="activeTab = 'tab1'" type="button">
          صفحه
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" :class="{ active: activeTab === 'tab2' }" @click="activeTab = 'tab2'" type="button">
          معنی
        </button>
      </li>
    </ul>

    <!-- محتوای تب‌ها -->
    <div class="tab-content mt-4">
      <!-- تب سوره -->
      <div v-show="activeTab === 'tab1'" class="tab-pane fade show active card p-4" :style="contentStyleTab1">
        <div class="original text-center">

          <!-- نام سوره -->
          <div class="d-flex justify-content-center flex-wrap gap-1">
            <span v-for="x in surahTitleItems" :key="x.id" class="fw-bold surah-title">
              سوره {{ x.name }}
            </span>
          </div>

          <!-- بسم‌الله -->
          <div class="d-flex justify-content-center flex-wrap gap-1 mt-3">
            <span
              v-for="word in secondLineItems"
              :key="word.id"
              style="font-size: 2.4rem;"
              :class="word.type === 3 ? 'basmala word-hover QCF_BSML' : 'normal-word word-hover QCF_BSML'"
            >
              {{ word.code }}
            </span>
          </div>

          <!-- بخش صوت صفحه با آیکون و متن کنار هم -->
          <div class="d-flex justify-content-between align-items-center mt-3" style="max-width: 80%; margin: 0 auto;">
            <button type="button" class="button btn p-0 text-white d-flex align-items-center gap-2" style="margin-top: 4px;">
              <i class="bi bi-play-fill fs-5"></i>
              <span>بخش صوت</span>
            </button>

            <button type="button" class="button btn p-0 text-secondary">
              <i class="bi bi-gear-fill fs-5"></i>
            </button>
          </div>

          <audio ref="wordAudio" :src="audioSrc" preload="auto"></audio>

          <div v-if="isLoadingSurah" class="skeleton-wrapper">
            <div class="skeleton-line" v-for="n in 8" :key="n"></div>
          </div>
          <!-- آیات بر اساس صفحه -->
          <div v-else v-for="group in filteredItems" :key="group.page" class="p-2 my-3" style="user-select: text !important;width: 562.781px;margin: 0 auto;">
            <template v-for="(x, index) in group.items" :key="`${x.id}-${x.verse_number}-${x.word_number}-${x.code}-${index}`">
              <div
                v-if="x === group.items[0] || x.line !== group.items[group.items.indexOf(x) - 1]?.line"
                class="d-flex flex-wrap no-drag position-relative"
                :style="{
                  lineHeight: '3.2rem',
                  justifyContent: (surahno === 1 || surahno === 2 || surahno === 114 || surahno === 113 || surahno === 112) && (x.page === 1 || x.page === 2 || x.page === 604) 
                    ? 'center' 
                    : 'space-between',
                  alignItems: 'center',
                  gap: '2px',
                  userSelect: 'text !important'
                }"
              >
                <template
                  v-for="y in group.items.filter(i => i.line === x.line)"
                  :key="`${y.id}-${y.verse_number}-${y.word_number}-${y.code}`"
                >
                  <span
                    @click.stop="toggleTooltip(y.id); playAudioWord(y, surahno)"
                    :class="[
                      y.type == 3 ? 'basmala word-hover fontSizeNumber font-QCF_P001' : 'normal-word word-hover custom-font',
                      'font-' + y.fontName,
                      'position-relative',
                      'custom-font'
                    ]"
                    :style="y.type == 1 ? 'font-size: 35.28px;' : (y.type == 2 ? 'font-size: 3.3rem;' : (y.type == 3 ? 'font-size: 1rem;' : ''))"
                  >
                    {{ y.type === 3 ? `﴿${y.code}﴾` : y.code }}

                    <!-- تولتیپ -->
                    <div
                      v-if="activeTooltipId === y.id"
                      class="custom-tooltip"
                      @click.stop
                    >
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-light">{{ y.code }}</small>
                        <button
                          type="button"
                          class="btn-close btn-close-white btn-sm"
                          style="font-size: 16px;"
                          aria-label="بستن"
                          @click="closeTooltip"
                        ></button>
                      </div>

                      <div class="d-flex justify-content-around gap-2">
                        <button type="button" class="btn btn-sm btn-outline-light" @click="playAudioWord(y)">
                          <i class="bi bi-play-fill"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="copyWord(y.arabic_text)">
                          <i class="bi bi-clipboard"></i>
                        </button>
                        <router-link :to="`/quran/details/${surahno}/${y.verse_number}`">
                          <button type="button" class="btn btn-sm btn-outline-secondary">
                            <i class="bi bi-three-dots"></i>
                          </button>
                        </router-link>
                      </div>
                    </div>
                  </span>
                </template>
              </div>
            </template>

            <!-- شماره صفحه -->
            <div class="text-center mt-4">
              <span style="color: darkgray; font-size: 1rem;">صفحه {{ group.page }}</span>
            </div>
            <hr class="bg-secondary mt-1" />
          </div>

          <!-- دکمه‌های جابه‌جایی سوره -->
          <div class="d-flex justify-content-between mt-4" v-show="surahno !== null">
            <button
              @click="goToPrevSurah"
              :disabled="surahno <= 1"
              class="btn btn-outline-light"
            >
              ▶ سوره قبلی
            </button>

            <button
              @click="goToNextSurah"
              :disabled="surahno >= maxSurah"
              class="btn btn-outline-light"
            >
              سوره بعدی ◀
            </button>
          </div>
        </div>
      </div>

      <!-- تب دوم -->
      <div v-show="activeTab === 'tab2'" class="tab-pane fade show active card p-4" :style="contentStyleTab2">
          <div class="original text-center">

          <!-- نام سوره -->
          <div class="d-flex justify-content-center flex-wrap gap-1">
            <span v-for="x in surahTitleItems" :key="x.id" class="fw-bold surah-title">
              سوره {{ x.name }}
            </span>
          </div>

          <!-- بسم‌الله -->
          <div class="d-flex justify-content-center flex-wrap gap-1 mt-3">
            <span
              v-for="word in secondLineItems"
              :key="word.id"
              style="font-size: 2.4rem;"
              :class="word.type === 3 ? 'basmala word-hover QCF_BSML' : 'normal-word word-hover QCF_BSML'"
            >
              {{ word.code }}
            </span>
          </div>

          <!-- بخش صوت صفحه با آیکون و متن کنار هم -->
          <div class="d-flex justify-content-between align-items-center mt-3" style="max-width: 100%; margin: 0 auto;">
            <button type="button" class="button btn p-0 text-white d-flex align-items-center gap-2" style="margin-top: 4px;">
              <i class="bi bi-play-fill fs-5"></i>
              <span>بخش صوت</span>
            </button>

            <button type="button" class="button btn p-0 text-secondary">
              <i class="bi bi-gear-fill fs-5"></i>
            </button>
          </div>

          <audio ref="wordAudio" :src="audioSrc" preload="auto"></audio>

          <div
            v-for="(item, index) in verses"
            :key="index"
            class="verse-container"
            style="margin-top: 30px; direction: ltr;"
          >
            <!-- آیکون‌ها سمت چپ -->
            <div class="icons-bar" style="display: flex; margin-bottom: 5px;">
              <i style="font-size: 14px;">{{ item.page_number }} : {{ item.page_count }}</i>
              <i class="fa-regular fa-copy" style="cursor: pointer;" @click="copyText(item.verse)"></i>
              <i class="fa-regular fa-file-lines"></i>
              <i class="fa-solid fa-play" style="cursor: pointer;" @click="playAudio(item.ayahNumber)"></i>
              <i class="fa-regular fa-comment"></i>
              <i class="fa-solid fa-ellipsis"></i>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
              <!-- متن عربی سمت راست -->
              <div class="arabic-text columns" >
                <span>{{ item.verse }}</span>
                <span class="ayah-number">{{ item.ayahNumber }}</span>
              </div>
              <!-- ترجمه انگلیسی وسط -->
              <div class="translation columns" style="justify-content: start;">
                {{ item.translation }}
              </div>
            </div>
          </div>

          </div>
      </div>
    </div>

  </div>
</template>



<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  id_sure: Number
});

// متغیرها
const activeTab = ref('tab1');
const surahTitleItems = ref([]);
const secondLineItems = ref([]);
const filteredItems = ref([]); // آرایه‌ای از { page: Number, items: [...] }
const surahno = ref(null);
const maxSurah = ref(114);
const nextVersesUrl = ref(null);
const loadingNext = ref(false);
const audioSrc = ref(null);
const activeTooltipId = ref(null);
const isLoadingSurah = ref(true);

const globalWordKeys = new Set();

const contentStyleTab1 = {
  backgroundColor: 'var(--bg-dark)',
  color: 'white',
  border: 'none',
  maxWidth: '690px',
  margin: '0 auto',
  textAlign: 'justify',
  textJustify: 'inter-word',
};

const contentStyleTab2 = {
  backgroundColor: 'var(--bg-dark)',
  color: 'white',
  border: 'none',
  maxWidth: '100%',
  margin: '0 auto',
  textAlign: 'justify',
  textJustify: 'inter-word',
};

const wordAudio = ref(null);

// ریست کردن داده‌ها
const resetSurah = () => {
  filteredItems.value = [];
  surahTitleItems.value = [];
  secondLineItems.value = [];
  nextVersesUrl.value = null;
  activeTooltipId.value = null;
  audioSrc.value = null;
  globalWordKeys.clear();
};

// آرایه آیات
const verses = ref([
  {
    page_count: 3,
    page_number: 1,
    ayahNumber: 1,
    verse: "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ",
    translation: "In the Name of Allah—the Most Compassionate, Most Merciful."
  },
  {
    page_count: 3,
    page_number: 2,
    ayahNumber: 2,
    verse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "All praise is due to Allah, Lord of the Worlds."
  },
  {
    page_count: 3,
    page_number: 3,
    ayahNumber: 3,
    verse: "الرَّحْمَـٰنِ الرَّحِيمِ",
    translation: "The Most Compassionate, the Most Merciful."
  }
]);

// تابع کپی متن آیه با شماره آیه ورودی
const copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert("متن آیه کپی شد ✅");
  });
};

// تابع پخش صوت (فعلاً صرفاً نمایش پیام)
const playAudio = (ayahNumber) => {
  alert(`پخش صوت آیه شماره ${ayahNumber} (اینجا می‌توانید فایل صوتی اضافه کنید)`);
};

// بارگذاری فونت‌ها (تنها یک‌بار)
const loadFont = (fontName, fontPath) => {
  if (document.getElementById(`font-style-${fontName}`)) return;
  const style = document.createElement('style');
  style.id = `font-style-${fontName}`;
  style.innerHTML = `
    @font-face {
      font-family: '${fontName}';
      src: url('${fontPath}');
    }
    .font-${fontName} {
      font-family: '${fontName}';
    }
  `;
  document.head.appendChild(style);
};

// حذف آیتم‌های تکراری بر اساس id
function removeDuplicatesById(words) {
  const seen = new Set();
  return words.filter(word => {
    if (seen.has(word.id)) return false;
    seen.add(word.id);
    return true;
  });
}

// چک کردن وجود آیتم در filteredItems
function wordExistsInFiltered(id) {
  return filteredItems.value.some(pg => pg.items.some(w => w.id === id));
}

// گروه‌بندی آیتم‌ها بر اساس خط داخل هر صفحه
const groupedItemsByLine = computed(() => {
  return filteredItems.value.map(pageGroup => {
    const linesMap = new Map();

    pageGroup.items.forEach(item => {
      if (!linesMap.has(item.line)) {
        linesMap.set(item.line, []);
      }
      linesMap.get(item.line).push(item);
    });

    const linesArray = [];
    linesMap.forEach((items, line) => {
      // مرتب سازی کلمات بر اساس شماره کلمه (word_number)
      items.sort((a, b) => (a.word_number ?? 0) - (b.word_number ?? 0));
      linesArray.push({ line, items });
    });

    // مرتب سازی خطوط بر اساس شماره خط
    linesArray.sort((a, b) => a.line - b.line);

    return {
      page: pageGroup.page,
      lines: linesArray,
    };
  });
});

// توابع تغییر سوره
const goToNextSurah = () => {
  if (surahno.value < maxSurah.value) {
    surahno.value++;
    resetSurah();
    loadSurah();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    isLoadingSurah.value = true;

  }
};
const goToPrevSurah = () => {
  if (surahno.value > 1) {
    surahno.value--;
    resetSurah();
    loadSurah();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    isLoadingSurah.value = true;

  }
};


// تابع اصلی بارگذاری سوره و آیات (صفحه به صفحه)
const loadSurah = async (url = null) => {
  const apiUrl =
    url ||
    `http://localhost:8000/api/v1/quran/surahs/?id=${surahno.value}&name=&english_name=&juz=&page_number=`;

  try {
    const response = await axios.get(apiUrl);
    if (!response.data.results.length) return;

    const surah = response.data.results[0];

    // ✅ همیشه مقداردهی کن
    surahTitleItems.value = [surah];
    secondLineItems.value = surah.bismillah || [];

    const verses = surah.verses?.results || [];
    const allWords = [];

    // جمع‌آوری تمام کلمات از همه صفحات
    verses.forEach(verse => {
      if (Array.isArray(verse.items)) {
        verse.items.forEach(word => {
          // جلوگیری از تکرار با Set سراسری و چک کردن در filteredItems
          if (!globalWordKeys.has(word.id) && !wordExistsInFiltered(word.id)) {
            globalWordKeys.add(word.id);
            allWords.push(word);
          }
        });
      }
    });

    // گروه‌بندی کلمات بر اساس صفحه
    const groupedByPage = {};
    const fontSet = new Set();

    allWords.forEach(word => {
      const page = word.page || 0;
      if (!groupedByPage[page]) groupedByPage[page] = [];
      groupedByPage[page].push(word);

      if (word.fontName && word.fontPage) {
        fontSet.add(`${word.fontName}|${word.fontPage}`);
      }
    });

    // ادغام داده‌های جدید با filteredItems
    Object.keys(groupedByPage).forEach(page => {
      const newItems = removeDuplicatesById(groupedByPage[page]);
      const existingPage = filteredItems.value.find(p => p.page === Number(page));

      if (existingPage) {
        existingPage.items = removeDuplicatesById([...existingPage.items, ...newItems]);
      } else {
        filteredItems.value.push({ page: Number(page), items: newItems });
      }
    });

    // مرتب سازی صفحات و حذف تکراری‌های درون هر صفحه
    filteredItems.value.sort((a, b) => a.page - b.page);
    filteredItems.value.forEach(pg => {
      pg.items = removeDuplicatesById(pg.items);
    });

    // بارگذاری فونت‌ها فقط یکبار
    fontSet.forEach(fontStr => {
      const [fontName, fontPage] = fontStr.split('|');
      loadFont(fontName, fontPage);
    });

    nextVersesUrl.value = surah.verses?.next || null;

  } catch (err) {
    console.error("Axios error:", err);
  } finally {
    isLoadingSurah.value = false;
  }
};

// اسکرول بی‌نهایت برای بارگذاری صفحات بعدی
const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    if (nextVersesUrl.value && !loadingNext.value) {
      loadingNext.value = true;
      loadSurah(nextVersesUrl.value).finally(() => {
        loadingNext.value = false;
      });
    }
  }
};


// پخش صوت کلمه
const playAudioWord = (word, surah = surahno.value) => {
  const audio = wordAudio.value;
  const url = `http://localhost:8000/api/v1/quran/audio/collection/?surah_id=${surah}&ayah_id=${word.verse_number}&word_id=${word.word_number}`;

  axios
    .get(url)
    .then((response) => {
      const audioUrl = response.data.audio_url;
      if (!audioUrl) return;

      if (audioSrc.value === audioUrl) {
        audio.currentTime = 0;
        audio.play().catch((err) => console.error('خطا در پخش مجدد:', err));
        return;
      }

      audioSrc.value = audioUrl;
      nextTick(() => {
        audio.load();
        audio.play().catch((err) => console.error('خطا در پخش صوت:', err));
      });
    })
    .catch((error) => {
      console.error('خطا در دریافت صوت:', error);
    });
};

// مدیریت تولتیپ (نمایش توضیح کلمه)
const toggleTooltip = (id) => {
  activeTooltipId.value = activeTooltipId.value === id ? null : id;
};

const closeTooltip = () => {
  activeTooltipId.value = null;
};

// کپی کردن متن کلمه
const copyWord = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('کلمه کپی شد');
    });
  } else {
    alert('کپی متن پشتیبانی نمی‌شود');
  }
};

// واکنش به تغییر props.id_sure
watch(
  () => props.id_sure,
  (newVal) => {
    surahno.value = newVal;
    resetSurah();
    isLoadingSurah.value = true;
    loadSurah();
  },
  { immediate: true }
);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
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

.fontSizeNumber {
  font-size: 1rem;
}

.fontSizeWord {
  font-size: 2.3rem;
}

.no-drag {
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.page-content {
  background-color: var(--bg-dark);
  min-height: 300px;
  border-radius: 1rem;
}

.normal-word {
  color: white;
  font-size: 1.5rem;
  /* margin: 0 1px; */
}

.basmala {
  font-family: 'Scheherazade New', serif;
  color: cornflowerblue;
  font-size: 1.7rem;
  margin: 0 1px;
}

.word-hover {
  transition: color 0.15s ease-out;
  cursor: pointer;
}

.word-hover:hover {
  color: #00bfff;
}

.surah-title {
  color: white;
  font-size: 1.8rem;
}

.bg-audio {
  color: white;
  direction: rtl; /* اگر راست‌به‌چپ می‌خوای */
}

.button:focus,
.button:active {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* .button:hover {
  color: rgba(127, 157, 255, 0.445);
} */

 .custom-word {
  cursor: pointer;
  position: relative;
  transition: color 0.25s ease, text-shadow 0.25s ease;
}
.custom-word:hover {
  color: #0dcaf0; /* آبی روشن */
  text-shadow: 0 0 8px #0dcaf0;
}

/* انیمیشن ظاهر شدن تولتیپ */
.tooltip-fade-scale-enter-active, .tooltip-fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.tooltip-fade-scale-enter-from, .tooltip-fade-scale-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
.tooltip-fade-scale-enter-to, .tooltip-fade-scale-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.word-tooltip {
  bottom: auto;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 140px;
  max-width: 200px;
  text-align: right;
  white-space: nowrap;
  padding: 0.5rem;
  margin-top: 6px;
}

.word-tooltip button {
  font-size: 0.85rem;
  color: var(--text-light);
  background: none;
  border: none;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.word-tooltip button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.custom-tooltip {
  min-width: 200px;
  z-index: 1050;
  background-color: var(--bg-dark);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 5px 10px 10px 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  animation: fadeInScale 0.3s ease-out;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

/* انیمیشن باز شدن تولتیپ */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

/* فلش کوچک زیر تولتیپ */
.custom-tooltip::after {
  content: "";
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent rgba(20, 20, 20, 0.9) transparent;
}



.skeleton-wrapper {
  padding: 20px 10px;
}

.skeleton-line {
  width: 80%;
  height: 35px;
  margin: 6px auto;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-color: rgba(255, 255, 255, 0.08);
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

.skeleton-line {
  background-size: 400px 100%;
}

.columns{
  height: 50%;
  width: 100%;
  padding: 10px 10px;
  display: flex;
  align-items: center;
}

.verse-container {
  display: flex;
  /* align-items: center; */
  /* justify-content: space-between; */
  padding: 1rem 0;
  border-bottom: 1px solid #636363;
  position: relative;
  min-height: 120px;
}

/* آیکون‌های سمت چپ */
.icons-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #aaa;
  font-size: 1.2rem;
  width: 30px;
}

.icons-bar i {
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.icons-bar i:hover {
  color: #fff;
  transform: scale(1.2);
}

/* متن ترجمه انگلیسی */
.translation {
  text-align: center;
  flex: 1;
  font-size: 1.1rem;
  color: #f1f1f1;
  padding: 0 2rem;
}

/* متن عربی */
.arabic-text {
  font-family: 'Amiri', serif;
  font-size: 1.8rem;
  direction: rtl;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  white-space: nowrap;
}

/* شماره آیه در دایره */
.ayah-number {
  width: 28px;
  height: 28px;
  border: 2px solid #999;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #fff;
  font-weight: bold;
  flex-shrink: 0;
}
</style>
