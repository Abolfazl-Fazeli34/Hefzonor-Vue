این رو دریت کن و کد نهاییی رو بده : <template>
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
              {{ x.word }}
            </span>
          </div>

          <!-- بسم‌الله -->
          <div class="d-flex justify-content-center flex-wrap gap-1 mt-3">
            <span v-for="x in secondLineItems" :key="x.id"
              :class="x.type === 3 ? 'basmala word-hover' : 'normal-word word-hover'">
              {{ x.type === 3 ? `﴿${x.word}﴾` : x.word }}
            </span>
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



          <!-- آیات بر اساس صفحه -->
          <div v-for="group in filteredItems" :key="group.page" class="p-2 my-3">
            <template v-for="(x, index) in group.items" :key="x.id">
              <div
                v-if="index === 0 || x.line !== group.items[index - 1].line"
                class="d-flex flex-wrap no-drag"
                style="line-height: 3.2rem; justify-content: center; align-items: center;gap: 2px;"
              >
                <template v-for="y in group.items.filter(i => i.line === x.line)" :key="y.id">
                 <span
                  :class="[y.type == 3 ? 'basmala word-hover fontSizeNumber' : 'normal-word word-hover custom-font', 'font-' + y.fontName]"
                  :style="(y.type == 1 ? 'font-size: 2.5rem;': ''), (y.type == 2 ? 'font-size: 3.3rem;' : ''), (y.type == 3 ? 'font-size: 1.3rem;': '')">
                  {{ y.type === 3 ? `﴿${y.word}﴾` : y.code }}
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
          <div class="d-flex justify-content-between mt-4">
            <button @click="goToPrevSurah" :disabled="surahno <= 1" class="btn btn-outline-light">
              ▶ سوره قبلی
            </button>
            <button @click="goToNextSurah" :disabled="surahno >= maxSurah" class="btn btn-outline-light">
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
    id_sure: Number
  },
  data() {
    return {
      activeTab: 'tab1',
      surahTitleItems: [],
      secondLineItems: [],
      filteredItems: [],
      surahno: null,
      maxSurah: 114,
      audioData: null,
      qari: 1,
      sure: 1,
      page: 1,
      srcSound:null,
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
      fontName:'',
    };
  },
  watch: {
    id_sure: {
      immediate: true,
      handler(newVal) {
        this.surahno = newVal;
        this.loadSurah();
      }
    },
  },
  methods: {
    goToNextSurah() {
      if (this.surahno < this.maxSurah) {
        this.surahno++;
        this.loadSurah();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    goToPrevSurah() {
      if (this.surahno > 1) {
        this.surahno--;
        this.loadSurah();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    loadSurah() {
      axios
        .get(`http://localhost:8000/quran/quran15/?surah=${this.surahno}`)
        .then((response) => {
          this.surahTitleItems = response.data.title || [];
          this.secondLineItems = response.data.bismillah || [];
          const ayahData = response.data.ayah || {};

          this.filteredItems = [];

          const fontSet = new Set();

          for (const page in ayahData) {
            const items = ayahData[page];

            items.forEach(item => {
              if (item.fontName && item.fontPage) {
                fontSet.add(item.fontName + '|' + item.fontPage);
              }
            });

            this.filteredItems.push({
              page: Number(page),
              items: items
            });
          }

          fontSet.forEach(fontStr => {
            const [fontName, fontPage] = fontStr.split('|');
            this.loadFont(fontName, fontPage);
          });

        })
        .catch((err) => {
          console.error('Axios error:', err);
        });
    },

    playSound() {
      axios
        .get(`http://localhost:8000/audio/get-page-audio/?qari=${this.qari}&sure=${this.sure}&page=${this.page}`)
        .then(response => {
          this.audioData = response.data.url; 
          this.$emit('send-audio-data', this.audioData);
          console.log(this.numberPage);
          // console.log(this.audioData);

          // console.log('Audio data:', this.audioData);
        })
        .catch(error => {
          console.error(error);
        });
    },
    loadFont(fontName, fontPath) {
    // بررسی اینکه آیا این فونت قبلاً لود شده
    if (document.getElementById(`font-style-${fontName}`)) return;

    const style = document.createElement('style');
    style.id = `font-style-${fontName}`;
    console.log()
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
  }

  }
};
</script>

<style scoped>

/* @font-face {
  font-family: 'QCF_P001';
  src: url('/public/fonts/QCF_P001.TTF');
}
.custom-font {
  font-family: 'QCF_P001', sans-serif;
} */

.fontSizeNumber{
  font-size: 1rem;
}
.fontSizeWord{
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
  transition: color .15s ease-out;
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
.button:focus, .button:active {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}
/* .button:hover{
  color: rgba(127, 157, 255, 0.445)
} */
</style>