<template>
  <div class="container my-4 p-4 rounded page-content">
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
            <div v-for="x in secondLineItems" :key="x.id">
              <span v-for="word in x.bismillah" :key='word.id' style="font-size: 2.4rem;" :class="x.type === 3 ? 'basmala word-hover QCF_BSML' : 'normal-word word-hover QCF_BSML'">{{ word.code }}</span>
            </div>
          </div>

          <!-- بخش صوت صفحه با آیکون و متن کنار هم -->
          <div class="d-flex justify-content-between align-items-center mt-3" style="max-width: 80%; margin: 0 auto;">
            <!-- دکمه پخش (راست) -->
            <button type="button" class="button btn p-0 text-white d-flex align-items-center gap-2" style="margin-top: 4px;" @click="playSound()">
              <i class="bi bi-play-fill fs-5"></i>
              <span>بخش صوت</span>
            </button>

            <!-- دکمه تنظیمات (چپ) -->
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
                    @click.stop="toggleTooltip(y.id) & playAudioWord(y, surahno)"
                    :class="[
                      y.type == 3 ? 'basmala word-hover fontSizeNumber' : 'normal-word word-hover custom-font',
                      'font-' + y.fontName,
                      'position-relative'
                    ]"
                    :style="y.type == 1 ? 'font-size: 2.5rem;' : (y.type == 2 ? 'font-size: 3.3rem;' : (y.type == 3 ? 'font-size: 1.3rem;' : ''))"
                  >
                    {{ y.type === 3 ? `﴿${y.code}﴾` : y.code }}

                    <!-- تولتیپ مشابه AudioPlayer -->
                    <div
                      v-if="activeTooltipId === y.id"
                      class="custom-tooltip"
                      @click.stop
                    >
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-light">{{ y.code }}</small>
                        <button type="button" class="btn-close btn-close-white btn-sm" style="font-size: 16px;" aria-label="بستن" @click="closeTooltip"></button>
                      </div>
                      <div class="d-flex justify-content-around gap-2">
                        <button type="button" class="btn btn-sm btn-outline-light" @click="playAudioWord(y)">
                          <i class="bi bi-play-fill"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="copyWord(y.arabic_text)">
                          <i class="bi bi-clipboard"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click.prevent>
                          <i class="bi bi-three-dots"></i>
                        </button>
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
              :disabled="surahno <= 1 || !allSurahPagesLoaded"
              class="btn btn-outline-light"
            >
              ▶ سوره قبلی
            </button>

            <button
              @click="goToNextSurah"
              :disabled="surahno >= maxSurah || !allSurahPagesLoaded"
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


<script>
import axios from 'axios';

export default {
  name: 'TabbedContent',
  props: {
    id_sure: Number,
  },
  data() {
    return {
      activeTab: 'tab1',
      surahTitleItems: [],
      secondLineItems: [],
      filteredItems: [], // آرایه‌ای از صفحات و کلمات هر صفحه
      surahno: null,
      maxSurah: 114,
      audioData: null,
      qari: 1,
      sure: 1,
      page: 1,
      srcSound: null,
      contentStyle: {
        backgroundColor: 'var(--bg-dark)',
        color: 'white',
        border: 'none',
        maxWidth: '690px',
        margin: '0 auto',
        textAlign: 'justify',
        textJustify: 'inter-word',
      },
      numberPage: '',
      fontName: '',
      nextVersesUrl: null, // برای نگهداری لینک صفحه بعدی pagination آیات
      loadingNext: false, // برای جلوگیری از درخواست‌های همزمان در infinite scroll
      audioSrc: null,
      activeTooltipId: null,  // شناسه‌ی کلمه فعال برای نمایش تولتیپ
    };
  },
  watch: {
    id_sure: {
      immediate: true,
      handler(newVal) {
        this.surahno = newVal;
        this.resetSurah();
        this.loadSurah();
      },
    },
  },
  computed: {
    allSurahPagesLoaded() {
      if (!this.filteredItems.length) return false;
      const loadedPages = this.filteredItems.map((group) => group.page);
      const maxPageLoaded = Math.max(...loadedPages);
      return this.nextVersesUrl === null && maxPageLoaded !== 0;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    resetSurah() {
      this.filteredItems = [];
      this.surahTitleItems = [];
      this.secondLineItems = [];
      this.nextVersesUrl = null;
      this.activeTooltipId = null;
      this.audioSrc = null;
    },
    handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        if (this.nextVersesUrl && !this.loadingNext) {
          this.loadingNext = true;
          this.loadSurah(this.nextVersesUrl).finally(() => {
            this.loadingNext = false;
          });
        }
      }
    },
    goToNextSurah() {
      if (this.surahno < this.maxSurah) {
        this.surahno++;
        this.resetSurah();
        this.loadSurah();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    goToPrevSurah() {
      if (this.surahno > 1) {
        this.surahno--;
        this.resetSurah();
        this.loadSurah();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    loadSurah(url = null) {
      const apiUrl =
        url || `http://localhost:8000/quran/surahs/?id=${this.surahno}&name=&english_name=&juz=&page_number=`;

      return axios
        .get(apiUrl)
        .then((response) => {
          if (!response.data.results.length) return;

          const surah = response.data.results[0];

          if (!this.surahTitleItems.length) {
            this.surahTitleItems = [surah];
            this.secondLineItems = [surah];
          }

          const allWords = [];

          if (surah.verses && surah.verses.results) {
            surah.verses.results.forEach((verse) => {
              if (verse.words && Array.isArray(verse.words)) {
                verse.words.forEach((word) => {
                  allWords.push(word);
                });
              }
            });
          }

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
            const existing = this.filteredItems.find((p) => p.page === Number(page));
            const sortedItems = groupedByPage[page].sort(
              (a, b) => a.line - b.line || a.word_number - b.word_number
            );

            if (existing) {
              const existingIds = new Set(existing.items.map((i) => i.id));
              const newItems = sortedItems.filter((item) => !existingIds.has(item.id));
              existing.items.push(...newItems);
            } else {
              this.filteredItems.push({
                page: Number(page),
                items: sortedItems,
              });
            }
          });

          fontSet.forEach((fontStr) => {
            const [fontName, fontPage] = fontStr.split('|');
            this.loadFont(fontName, fontPage);
          });

          this.nextVersesUrl = surah.verses.next;
        })
        .catch((err) => {
          console.error('Axios error:', err);
        });
    },
    loadFont(fontName, fontPath) {
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
    },
    playSound() {
      // در صورت نیاز فعال شود
    },
    playAudioWord(y, surah) {
      const audio = this.$refs.wordAudio;

      const url = `http://localhost:8000/quran/audio/combined/?surah_id=${surah}&ayah_id=${y.verse_number}&word_id=${y.word_number}`;

      axios
        .get(url)
        .then((response) => {
          const audioUrl = response.data.audio_url;
          // console.log(response.data)
          if (this.audioSrc === audioUrl) {
            audio.currentTime = 0;
            audio
              .play()
              .catch((err) => console.error('خطا در پخش مجدد:', err));
            return;
          }

          this.audioSrc = audioUrl;

          this.$nextTick(() => {
            audio.load();
            audio.play().catch((err) => console.error('خطا در پخش صوت:', err));
          });
        })
        .catch((error) => {
          console.error('خطا در دریافت صوت:', error);
        })
        .finally(() => {
          console.log('درخواست صوت به پایان رسید.');
        });
    },
    toggleWordTooltip(id) {
      this.activeTooltipId = this.activeTooltipId === id ? null : id;
    },
    closeTooltip() {
      this.activeTooltipId = null;
    },
    copyWord(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          alert('کلمه کپی شد');
        });
      } else {
        alert('کپی متن پشتیبانی نمی‌شود');
      }
    },
    toggleTooltip(id) {
      if (this.activeTooltipId === id) {
        this.activeTooltipId = null;
      } else {
        this.activeTooltipId = id;
      }
    },

  },
};
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
