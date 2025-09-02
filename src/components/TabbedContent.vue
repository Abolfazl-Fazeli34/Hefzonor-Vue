<template>
  <div class="my-4 p-4 rounded page-content" style="max-width: 1200px; margin: 0 auto;">
    <!-- تب‌ها -->
    <ul class="nav nav-tabs justify-content-center gap-2" id="tabExample" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link" :class="{ active: activeTab === 'tab1' }" @click="activeTab = 'tab1'" type="button">
          صفحه ای
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" :class="{ active: activeTab === 'tab2' }" @click="activeTab = 'tab2'" type="button">
          آیه ای
        </button>
      </li>
    </ul>

    <!-- محتوای تب‌ها -->
    <div class="tab-content mt-4">
      <!-- تب صفحه ای سوره -->
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
            <button
              type="button"
              class="button btn p-0 text-white d-flex align-items-center gap-2"
              style="margin-top: 4px;"
              @click="playSurahAudio1"
            >
              <i class="bi bi-play-fill fs-5"></i>
              <span>بخش صوت</span>
            </button>

            <button type="button" class="button btn p-0 text-secondary">
              <i class="bi bi-gear-fill fs-5"></i>
            </button>
          </div>

          <audio ref="wordAudio" :src="audioSrc" preload="auto"></audio>

          <!-- <div v-if="isLoadingSurah" class="skeleton-wrapper">
            <div class="skeleton-line" v-for="n in 8" :key="n"></div>
          </div> -->
          <!-- آیات بر اساس صفحه -->
          <div  v-for="group in filteredItems" :key="group.page" class="p-2 my-3" style="user-select: text !important;width: 562.781px;margin: 0 auto;">
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
                      y.type == 3 ? 'word-hover fontSizeNumber ' : 'normal-word word-hover font-' + y.fontName,
                      'font-' + y.fontName,
                      'position-relative',
                      'custom-font',
                      (currentAya && y.verse_number === currentAya.ayaNumber && surahno === currentAya.surahId) ? 'ayah-highlight' : ''
                    ]"
                    :id="'ayah-' + y.verse_number"
                    :style="y.type == 1 ? 'font-size: 35.28px;' : (y.type == 2 ? 'font-size: 3.3rem;' : (y.type == 3 ? 'font-size: 2rem; ' : ''))"
                  >
                    {{ y.type === 3 ? `${y.code}` : y.code }}

                    <!-- تولتیپ با گزینه اشتراک‌گذاری -->
                    <div
                      v-if="activeTooltipId === y.id"
                      class="custom-tooltip"
                      @click.stop
                    >
                      <!-- هدر تولتیپ -->
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

                      <!-- دکمه‌های عملیاتی -->
                      <div class="d-flex justify-content-around gap-2">
                        <!-- پخش آیه -->
                        <button style="height: 50%;" type="button" class="btn btn-sm btn-outline-light" @click="playAudioWord(y)" title="پخش آیه">
                          <i class="bi bi-play-fill"></i>
                        </button>

                        <!-- کپی آیه -->
                        <button style="height: 50%;" type="button" class="btn btn-sm btn-outline-secondary" @click="copyWord(y.arabic_text)" title="کپی آیه">
                          <i class="bi bi-clipboard"></i>
                        </button>

                        <!-- اشتراک‌گذاری -->
                        <button style="height: 50%;" type="button" class="btn btn-sm btn-outline-secondary" @click="shareAya(y)" title="اشتراک‌گذاری آیه">
                          <i class="bi bi-share-fill"></i>
                        </button>

                        <!-- ترجمه و تفسیر آیه -->
                        <router-link :to="`/quran/details/${surahno}/${y.verse_number}`" style="display: contents;">
                          <button style="height: 50%;" type="button" class="btn btn-sm btn-outline-secondary" title="ترجمه و تفسیر">
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

      <!-- تب آیه‌ای سوره -->
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

          <!-- بخش صوت صفحه -->
          <div class="d-flex justify-content-between align-items-center mt-3" style="max-width: 100%; margin: 0 auto;">
            <button 
              type="button" 
              class="button btn p-0 text-white d-flex align-items-center gap-2" 
              style="margin-top: 4px;"
              @click="playAllPagesAudio" 
            >
              <i class="bi bi-play-fill fs-5"></i>
              <span>پخش صوت</span>
            </button>


            <button type="button" class="button btn p-0 text-secondary">
              <i class="bi bi-gear-fill fs-5"></i>
            </button>
          </div>

          <audio ref="wordAudio" :src="audioSrc" preload="auto"></audio>

          <!-- آیات به صورت داینامیک -->
          <div
            v-for="(group, index) in ayahWiseItems"
            :key="index"
            class="verse-container"
            :style="{
              marginTop: '30px',
              direction: 'ltr',
            }"
          >

            <!-- آیکون‌ها سمت چپ -->
            <div class="icons-bar" style="display: flex; margin-bottom: 5px;">
              <i style="font-size: 14px;">{{ surahno }} : {{ group.verse }}</i>
              <i class="fa-regular fa-copy" style="cursor: pointer;" @click="copyWord(group.text)"></i>
              <i class="fa-regular fa-file-lines"></i>
              <i class="fa-solid fa-play" style="cursor: pointer;" ></i>
              <i class="fa-regular fa-comment"></i>
              <i class="fa-solid fa-ellipsis"></i>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
              <!-- متن عربی سمت راست -->
              <div class="arabic-text columns">
                <span
                  style="line-height: 3.5rem; display: flex;align-items: center;"
                 :style="{
  backgroundColor: currentPlayingKey === group.key
    ? 'rgba(0, 123, 255, 0.2)'
    : 'transparent',
  transition: 'background-color 0.4s ease'
}"

                >
                  {{ group.text }}
                  <span style="margin-left: 5px;" class="ayah-number">{{ group.verse }}</span>
                </span>

              </div>
              <div class="translation columns" style="justify-content: start;">
                {{ group.translation || 'ترجمه موجود نیست.' }}
              </div>

            </div>
          </div>

          <!-- دکمه‌های جابه‌جایی سوره -->
          <div class="d-flex justify-content-between mt-4" style="width: 50%; margin: 0 auto;" v-show="surahno !== null">
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

    </div>

  </div>

   <!-- ترجمه انگلیسی وسط -->
                <!-- <div class="translation columns" style="justify-content: start;">
                  The path of those upon whom Thou hast bestowed favors. Not (the path) of those upon whom Thy wrath is brought down, nor of those who go astray.
                </div> -->
</template>


<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import axios from 'axios';



import { useStore } from 'vuex';
const store = useStore();

const props = defineProps({
  id_sure: Number
});

// متغیرها
const activeTab = ref('tab1');
const surahTitleItems = ref([]);
const verse_count = ref()
const secondLineItems = ref([]);
const filteredItems = ref([]);
const surahno = ref(null);
const maxSurah = ref(114);
const nextVersesUrl = ref(null);
const audioSrc = ref(null);
const activeTooltipId = ref(null);
const isLoadingSurah = ref(true);

const globalWordKeys = new Set();
const translationsMap = ref({});
const wordAudio = ref(null);

const isPlaying = ref(false);
const currentAyahIndex = ref(null);
const audioList = ref([]);
const audioPlayer = ref(new Audio());
const currentPageIndex = ref(null);
let allPages = [];
const currentAya = computed(() => store.state.currentAya);


watch(
  () => currentAya.value, 
  (newVal) => {
    if (newVal) {
      const element = document.getElementById(`ayah-${newVal.ayaNumber}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }
  }
);

const playAllPagesAudio = async () => {
  if (!filteredItems.value.length) return;

  // گرفتن لیست تمام صفحات سوره
  allPages = filteredItems.value.map(pg => pg.page);
  allPages.sort((a, b) => a - b); // مرتب‌سازی برای اطمینان

  currentPageIndex.value = 0;
  isPlaying.value = true;

  // شروع پخش از اولین صفحه
  await fetchPageAudio(allPages[currentPageIndex.value]);
};



const playSurahAudio1 = () => {
  if (!surahTitleItems.value.length) return;

  const surah = surahTitleItems.value[0];
  store.dispatch('updateCurrentSurah', {
    id: surah.id,
    name: surah.name,
    aya_count: verse_count.value,
    automatic_sound: true
  });

};
const shareAya = (y) => {
  const url = window.location.href;
  const text = y.arabic_text;

  if (navigator.share) {
    // موبایل / مرورگرهایی که Web Share API دارند
    navigator.share({ title: `آیه: ${y.code}`, text, url })
      .catch(err => console.error('خطا در اشتراک‌گذاری:', err));
  } else {
    // دسکتاپ یا مرورگر بدون پشتیبانی
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    // باز کردن پنجره اشتراک‌گذاری توی شبکه‌های اجتماعی
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;

    // نمونه: باز کردن پنجره توی توییتر
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  }
};




const ayahAudioMap = ref({}); // آیه → لینک صوت

const fetchPageAudio = async (pageNumber) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/quran/audio/collection/?qari_id=1&page_number=${pageNumber}`);
    audioList.value = response.data.audio_urls;

    // ذخیره لینک برای هایلایت
    response.data.audio_urls.forEach((url, idx) => {
      ayahAudioMap.value[`${pageNumber}-${idx}`] = url;
    });

    currentAyahIndex.value = 0;
    playNextAudio();
  } catch (error) {
    console.error('خطا در دریافت صوت‌های صفحه:', error);
    goToNextPage();
  }
};


const currentPlayingKey = ref(null);


const playNextAudio = () => {
  if (currentAyahIndex.value === null || currentAyahIndex.value >= audioList.value.length) {
    goToNextPage();
    return;
  }

  const audioUrl = audioList.value[currentAyahIndex.value];
  // کلید منحصربه‌فرد: صفحه فعلی + ایندکس آیه
  currentPlayingKey.value = `${allPages[currentPageIndex.value]}-${currentAyahIndex.value}`;
  
  audioPlayer.value.src = audioUrl;
  audioPlayer.value.play().catch(err => console.error('خطا در پخش صوت:', err));

  audioPlayer.value.onended = () => {
    currentAyahIndex.value++;
    playNextAudio();
  };
};


const goToNextPage = async () => {
  currentPageIndex.value++;
  if (currentPageIndex.value >= allPages.length) {
    isPlaying.value = false;
    currentAyahIndex.value = null;
    currentPageIndex.value = null;
    return;
  }
  await fetchPageAudio(allPages[currentPageIndex.value]);
};


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

// بارگذاری فونت‌ها
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

// حذف آیتم‌های تکراری
function removeDuplicatesById(words) {
  const seen = new Set();
  return words.filter(word => {
    if (seen.has(word.id)) return false;
    seen.add(word.id);
    return true;
  });
}

// بررسی وجود آیتم
function wordExistsInFiltered(id) {
  return filteredItems.value.some(pg => pg.items.some(w => w.id === id));
}

// گروه‌بندی بر اساس خط
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
      items.sort((a, b) => (a.word_number ?? 0) - (b.word_number ?? 0));
      linesArray.push({ line, items });
    });

    linesArray.sort((a, b) => a.line - b.line);
    return { page: pageGroup.page, lines: linesArray };
  });
});

// بارگذاری ترجمه آیات
const loadVersesWithTranslation = async (surahId) => {
  try {
    const verseNumbers = new Set();
    filteredItems.value.forEach(pageGroup => {
      pageGroup.items.forEach(word => {
        if (word.verse_number) verseNumbers.add(word.verse_number);
      });
    });

    const map = {};
    for (const verse of verseNumbers) {
      const response = await axios.get(`http://localhost:8000/api/v1/quran/verse/translation/?verse=${verse}&translator=6&surah=${surahId}`);
      if (response.data.results && response.data.results.length > 0) {
        map[verse] = response.data.results[0].text;
      }
    }
    translationsMap.value = map;
  } catch (error) {
    console.error('خطا در بارگذاری ترجمه‌ها:', error);
    translationsMap.value = {};
  }
};

// گروه‌بندی آیه‌ای برای تب دوم
const ayahWiseItems = computed(() => {
  const verses = [];
  filteredItems.value.forEach(pageGroup => {
    let idx = 0;
    const verseMap = {};
    pageGroup.items.forEach(word => {
      if (word.verse_number) {
        if (!verseMap[word.verse_number]) {
          verseMap[word.verse_number] = {
            verse: word.verse_number,
            text: '',
            page: pageGroup.page,
            key: `${pageGroup.page}-${idx}`, // ✅ کلید یکتا برای مقایسه
            translation: translationsMap.value[word.verse_number] || '',
          };
          idx++;
        }
        verseMap[word.verse_number].text += word.arabic_text + ' ';
      }
    });
    verses.push(...Object.values(verseMap));
  });
  return verses;
});



// تغییر سوره
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



// بارگذاری سوره و تمام صفحات آن
const loadSurah = async (url = null) => {
  const apiUrl = url || `http://localhost:8000/api/v1/quran/surahs/?id=${surahno.value}`;
  try {
    const response = await axios.get(apiUrl);
    if (!response.data.results.length) return;

    const surah = response.data.results[0];
    if (!url) {
      surahTitleItems.value = [surah];
      verse_count.value = surah.verse_count
      secondLineItems.value = surah.bismillah || [];
    }

    const verses = surah.verses?.results || [];
    const allWords = [];
    const verseNumbers = new Set();

    verses.forEach(verse => {
      if (Array.isArray(verse.items)) {
        verse.items.forEach(word => {
          if (!globalWordKeys.has(word.id) && !wordExistsInFiltered(word.id)) {
            globalWordKeys.add(word.id);
            allWords.push(word);
            if (word.verse_number) verseNumbers.add(word.verse_number);
          }
        });
      }
    });

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

    Object.keys(groupedByPage).forEach(page => {
      const newItems = removeDuplicatesById(groupedByPage[page]);
      const existingPage = filteredItems.value.find(p => p.page === Number(page));
      if (existingPage) {
        existingPage.items = removeDuplicatesById([...existingPage.items, ...newItems]);
      } else {
        filteredItems.value.push({ page: Number(page), items: newItems });
      }
    });

    filteredItems.value.sort((a, b) => a.page - b.page);
    filteredItems.value.forEach(pg => {
      pg.items = removeDuplicatesById(pg.items);
    });

    fontSet.forEach(fontStr => {
      const [fontName, fontPage] = fontStr.split('|');
      loadFont(fontName, fontPage);
    });

    // ✅ بارگذاری ترجمه‌ها همزمان با لود هر صفحه
    for (const verse of verseNumbers) {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/quran/verse/translation/?verse=${verse}&translator=6&surah=${surahno.value}`);
        if (res.data.results && res.data.results.length > 0) {
          translationsMap.value[verse] = res.data.results[0].text;
        }
      } catch (err) {
        console.error('خطا در دریافت ترجمه همزمان:', err);
      }
    }

    nextVersesUrl.value = surah.verses?.next || null;

    // بارگذاری صفحات بعدی به‌صورت خودکار
    if (nextVersesUrl.value) {
      await loadSurah(nextVersesUrl.value);
    }

  } catch (err) {
    console.error("Axios error:", err);
  } finally {
    isLoadingSurah.value = false;
  }
};

// پخش صوت کلمه
const playAudioWord = (word, surah = surahno.value) => {
  const audio = wordAudio.value;
  const url = `http://localhost:8000/api/v1/quran/audio/collection/?surah_id=${surah}&ayah_id=${word.verse_number}&word_id=${word.word_number}`;
  axios.get(url).then(response => {
    const audioUrl = response.data.audio_url;
    if (!audioUrl) return;

    if (audioSrc.value === audioUrl) {
      audio.currentTime = 0;
      audio.play().catch(err => console.error('خطا در پخش مجدد:', err));
      return;
    }

    audioSrc.value = audioUrl;
    nextTick(() => {
      audio.load();
      audio.play().catch(err => console.error('خطا در پخش صوت:', err));
    });
  }).catch(error => {
    console.error('خطا در دریافت صوت:', error);
  });
};

// مدیریت تولتیپ
const toggleTooltip = (id) => {
  activeTooltipId.value = activeTooltipId.value === id ? null : id;
};
const closeTooltip = () => {
  activeTooltipId.value = null;
};

// کپی کردن متن
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
    rgba(255, 255, 255, 0.062) 25%,
    rgba(255, 255, 255, 0.233) 50%,
    rgba(255, 255, 255, 0.075) 75%
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
  /* white-space: nowrap; */
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

.ayah-highlight {
  background-color: rgba(0, 162, 255, 0.3); /* طلایی شفاف */
  border-radius: 6px;
  transition: background-color 0.3s ease;
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