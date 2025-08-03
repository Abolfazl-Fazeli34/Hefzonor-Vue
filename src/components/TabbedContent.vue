<template>
  <div class="my-4 p-4 rounded page-content" style="max-width: 950px; margin: 0 auto;">
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
      <div v-show="activeTab === 'tab1'" class="tab-pane fade show active card p-4" :style="contentStyle">
        <div class="original text-center">
          <!-- نام سوره -->
          <div class="d-flex justify-content-center flex-wrap gap-1">
            <span v-for="x in surahTitleItems" :key="x.id" class="fw-bold surah-title">
              سوره {{ x.name }}
            </span>
          </div>

          <!-- بسم‌الله -->
          <div class="d-flex justify-content-center flex-wrap gap-1 mt-3">
            <span v-for="word in secondLineItems" :key="word.id" style="font-size: 2.4rem;"
                  :class="word.type === 3 ? 'basmala word-hover QCF_BSML' : 'normal-word word-hover QCF_BSML'">
              {{ word.code }}
            </span>
          </div>


          <!-- بخش صوت صفحه با آیکون و متن کنار هم -->
          <div class="d-flex justify-content-between align-items-center mt-3" style="max-width: 80%; margin: 0 auto;">
            <button type="button" class="button btn p-0 text-white d-flex align-items-center gap-2"
                    style="margin-top: 4px;">
              <i class="bi bi-play-fill fs-5"></i>
              <span>بخش صوت</span>
            </button>

            <button type="button" class="button btn p-0 text-secondary">
              <i class="bi bi-gear-fill fs-5"></i>
            </button>
          </div>

          <audio ref="wordAudio" :src="audioSrc" preload="auto"></audio>

          <!-- آیات بر اساس صفحه -->
          <div v-for="group in filteredItems" :key="group.page" class="p-2 my-3">
            <template v-for="(x, index) in group.items" :key="x.id">
              <div
                v-if="index === 0 || x.line !== group.items[index - 1].line"
                class="d-flex flex-wrap no-drag position-relative"
                style="line-height: 3.2rem; justify-content: center; align-items: center; gap: 2px;"
              >
                <template v-for="y in group.items.filter(i => i.line === x.line)" :key="y.id">
                  <span
                    @click.stop="toggleTooltip(y.id); playAudioWord(y, surahno)"
                    :class="[
                      y.type == 3 ? 'basmala word-hover fontSizeNumber' : 'normal-word word-hover custom-font',
                      'font-' + y.fontName,
                      'position-relative'
                    ]"
                    :style="y.type == 1 ? 'font-size: 2.5rem;' : (y.type == 2 ? 'font-size: 3.3rem;' : (y.type == 3 ? 'font-size: 1.3rem;' : ''))"
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
                        <button type="button" class="btn-close btn-close-white btn-sm"
                                style="font-size: 16px;" aria-label="بستن" @click="closeTooltip"></button>
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
      <div v-show="activeTab === 'tab2'" class="tab-pane fade card p-4 mt-3" :style="contentStyle">
        <p style="color: white;">محتوای تب دوم</p>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';

const props = defineProps({
  id_sure: Number
});

// متغیرها
const activeTab = ref('tab1');
const surahTitleItems = ref([]);
const secondLineItems = ref([]);
const filteredItems = ref([]);
const surahno = ref(null);
const maxSurah = ref(114);
const nextVersesUrl = ref(null);
const loadingNext = ref(false);
const audioSrc = ref(null);
const activeTooltipId = ref(null);

const contentStyle = {
  backgroundColor: 'var(--bg-dark)',
  color: 'white',
  border: 'none',
  maxWidth: '690px',
  margin: '0 auto',
  textAlign: 'justify',
  textJustify: 'inter-word',
};

const wordAudio = ref(null);

// تابع ریست
const resetSurah = () => {
  filteredItems.value = [];
  surahTitleItems.value = [];
  secondLineItems.value = [];
  nextVersesUrl.value = null;
  activeTooltipId.value = null;
  audioSrc.value = null;
};

// اسکرول بی‌نهایت
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

// سوره بعدی
const goToNextSurah = () => {
  if (surahno.value < maxSurah.value) {
    surahno.value++;
    resetSurah();
    loadSurah();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// سوره قبلی
const goToPrevSurah = () => {
  if (surahno.value > 1) {
    surahno.value--;
    resetSurah();
    loadSurah();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// لود سوره
const loadSurah = (url = null) => {
  const apiUrl =
    url ||
    `http://localhost:8000/api/v1/quran/surahs/?id=${surahno.value}&name=&english_name=&juz=&page_number=`;

  return axios
    .get(apiUrl)
    .then((response) => {
      if (!response.data.results.length) return;
      const surah = response.data.results[0];

      // عنوان و بسم‌الله فقط یکبار
      if (!surahTitleItems.value.length) {
        surahTitleItems.value = [surah];
      }
      if (!secondLineItems.value.length && surah.bismillah) {
        secondLineItems.value = surah.bismillah;
      }

      const verses = surah.verses?.results || [];
      const allWords = [];

      verses.forEach((verse) => {
        if (verse.words && Array.isArray(verse.words)) {
          verse.words.forEach((word) => {
            allWords.push(word);
          });
        }
      });

      // گروه‌بندی بر اساس صفحه
      const groupedByPage = {};
      const fontSet = new Set();

      allWords.forEach((word) => {
        const page = word.page || 0;
        if (!groupedByPage[page]) {
          groupedByPage[page] = [];
        }
        groupedByPage[page].push(word);

        if (word.fontName && word.fontPage) {
          fontSet.add(`${word.fontName}|${word.fontPage}`);
        }
      });

      Object.keys(groupedByPage).forEach((page) => {
        const existing = filteredItems.value.find(
          (p) => p.page === Number(page)
        );
        const sortedItems = groupedByPage[page].sort(
          (a, b) => a.line - b.line || a.word_number - b.word_number
        );

        if (existing) {
          const existingIds = new Set(existing.items.map((i) => i.id));
          const newItems = sortedItems.filter(
            (item) => !existingIds.has(item.id)
          );
          existing.items.push(...newItems);
        } else {
          filteredItems.value.push({
            page: Number(page),
            items: sortedItems,
          });
        }
      });

      // بارگذاری فونت
      fontSet.forEach((fontStr) => {
        const [fontName, fontPage] = fontStr.split('|');
        loadFont(fontName, fontPage);
      });

      // صفحه بعدی
      nextVersesUrl.value = surah.verses?.next || null;
    })
    .catch((err) => {
      console.error('Axios error:', err);
    });
};

// لود فونت
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

// پخش صوت کلمه
const playAudioWord = (y, surah = surahno.value) => {
  const audio = wordAudio.value;
  const url = `http://localhost:8000/api/v1/quran/audio/collection/?surah_id=${surah}&ayah_id=${y.verse_number}&word_id=${y.word_number}`;

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

// تولتیپ
const toggleTooltip = (id) => {
  activeTooltipId.value = activeTooltipId.value === id ? null : id;
};

const closeTooltip = () => {
  activeTooltipId.value = null;
};

const copyWord = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('کلمه کپی شد');
    });
  } else {
    alert('کپی متن پشتیبانی نمی‌شود');
  }
};

// واکنش به تغییر id_sure
watch(
  () => props.id_sure,
  (newVal) => {
    surahno.value = newVal;
    resetSurah();
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


</style>
