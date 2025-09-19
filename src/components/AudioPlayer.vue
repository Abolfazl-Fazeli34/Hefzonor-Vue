<template>
  <div class="audio-player" :class="{ active: currentSurah }">
    <!-- نوار پیشرفت -->
    <div class="progress-container" @click="seek">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- زمان فعلی -->
    <span class="time-label">{{ formatTime(currentTime) }}</span>

    <!-- کنترل‌ها -->
    <div class="controls">

      <!-- ضربدر -->
      <button  
        style="font-size: 1.5rem;"
        v-if="currentSurah" 
        @click="clearCurrentSurah" 
        class="icon-button"
      >
        ✕
      </button>

      <!-- تنظیمات -->
      <div class="menu-group">
        <button data-modal-target="crud-modal" data-modal-toggle="crud-modal" class="icon-button">
          <i class="fas fa-ellipsis-h"></i>
        </button>

        <div class="volume-tooltip volume-tooltip-width-for-panel-setting" v-if="showMenu">
          <div class="translation-box border-green" style="margin-bottom: 0;">
            <h6 class="panel-title text-yellow-400 font-semibold mb-2">تنظیمات صوت</h6>

            <!-- انتخاب قاری -->
            <div class="form-group flex flex-col gap-1 w-full">
              <label class="form-label">انتخاب قاری:</label>
              <select v-model="settings.selectedQari" class="form-select flex-1">
                <option v-for="q in settings.qari" :key="q.id" :value="q">
                  {{ q.name }} ({{ q.type }})<span v-if="q.language"> ({{q.language}})</span>
                </option>
              </select>
            </div>
            <hr>

            <!-- محدوده پخش -->
            <div class="flex flex-col gap-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="settings.rangeEnabled" class="accent-yellow-400" />
                محدوده پخش
              </label>
              <div v-if="settings.rangeEnabled" class="flex flex-col gap-2">
                <!-- از -->
                <div class="display flex items-center gap-2">
                  <label class="w-12">از:</label>
                  <select v-model="settings.fromIndex" class="form-select flex-1 custom-offcanvas">
                    <option v-for="(f, index) in settings.from" :key="index" :value="index">
                      {{ f.surahName }} ({{ f.aya }})
                    </option>
                  </select>
                </div>

                <!-- تا -->
                <div class="display flex items-center gap-2">
                  <label class="w-12">تا:</label>
                  <select v-model="settings.toIndex" class="form-select flex-1 custom-offcanvas">
                    <option 
                      v-for="(t, index) in filteredToOptions" 
                      :key="index" 
                      :value="index + settings.fromIndex">
                      {{ t.surahName }} ({{ t.aya }})
                    </option>
                  </select>
                </div>

                <div class="display flex flex-col gap-1">
                  <label style="width: 150px;">تکرار محدوده:</label>
                  <input type="number" min="1" v-model="settings.repeatRange" class="form-input" />
                </div>

                <div class="display flex flex-col gap-1">
                  <label style="width: 150px;">تکرار آیه:</label>
                  <input type="number" min="1" v-model="settings.repeatAya" class="form-input" />
                </div>
              </div>
            </div>
            <hr>

            <!-- سرعت پخش -->
            <div class="form-group flex items-center gap-2 w-full">
              <label class="w-28">سرعت پخش:</label>
              <select v-model="settings.speed" class="form-select flex-1 custom-offcanvas">
                <option v-for="(s, index) in settings.speedOptions" :key="index" :value="s.value">
                  {{ s.label }}
                </option>
              </select>
            </div>

            <hr>

            <!-- وقفه بعد از قرائت -->
            <div class="form-group flex items-center gap-2 w-full">
              <label class="flex items-center gap-2 w-28">
                <input type="checkbox" v-model="settings.pauseAfter" class="accent-yellow-400" />
                وقفه بعد از قرائت
              </label>
              <input
                v-if="settings.pauseAfter"
                v-model="settings.PauseAfterRecitation" type="number" min="1" class="form-input" placeholder="ثانیه"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- کنترل پخش -->
      <button @click="rewind" class="icon-button" title="۱۰ ثانیه عقب">
        <i class="fas fa-rotate-left"></i>
      </button>

      <button @click="togglePlay" class="play-button">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>

      <button @click="forward" class="icon-button" title="۱۰ ثانیه جلو">
        <i class="fas fa-rotate-right"></i>
      </button>

      <!-- کنترل صدا -->
      <div class="volume-group">
        <button @click="toggleVolumeTooltip" class="icon-button">
          <i class="fas fa-volume-up"></i>
        </button>
        <div class="volume-tooltip" v-if="showVolume">
          <div class="translation-box border-green" style="padding: 3px 2px 2px 2px ; margin-bottom: 0;">
            <input type="range" min="0" max="1" step="0.01" v-model="volume" />
          </div>
        </div>
      </div>
    </div>

    <!-- زمان کل -->
    <span class="time-label">{{ formatTime(totalDuration) }}</span>

    <!-- پلیر -->
    <audio
      ref="audioRef"
      @timeupdate="updateTime"
      @loadedmetadata="setDuration"
    ></audio>
  </div>



  <div id="crud-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full transition-all">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    تنظیمات صوت
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form class="p-4 md:p-5">
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="default" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">انتخاب قاری</label>
                        <select v-model="settings.selectedQari" id="default" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          <option v-for="q in settings.qari" :key="q.id" :value="q">{{ q.name }} ({{ q.type }})<span v-if="q.language"> ({{q.language}})</span></option>
                        </select>
                    </div>

                    <div class="col-span-1">
                      <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">از:</label>
                      <select v-model="settings.fromIndex" name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        <option v-for="(f, index) in settings.from" :key="index" :value="index">
                          {{ f.surahName }} ({{ f.aya }})
                        </option>
                      </select>
                    </div>
                    <div class="col-span-1">
                        <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">تا:</label>
                        <select v-model="settings.toIndex" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          <option 
                            v-for="(t, index) in filteredToOptions" 
                            :key="index" 
                            :value="index + settings.fromIndex">
                            {{ t.surahName }} ({{ t.aya }})
                          </option>
                        </select>
                    </div>

                    <div class="col-span-1">
                        <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">تکرار محدوده</label>
                        <input v-model="settings.repeatRange" type="number" name="price" id="price" min="1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999"  >
                    </div>
                    <div class="col-span-1">
                        <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">تکرار آیه</label>
                        <input type="number" min="1" v-model="settings.repeatAya" name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999"  >
                    </div>

                    <div class="col-span-2">
                        <label for="default" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">سرعت بخش</label>
                        <select v-model="settings.speed" id="default" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          <option v-for="(s, index) in settings.speedOptions" :key="index" :value="s.value">
                            {{ s.label }}
                          </option>
                        </select>
                    </div>

                    <div class="col-span-2">
                        <label for="default" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">وقفه بعد از قرائت</label>
                        <input v-model="settings.PauseAfterRecitation" type="number" min="1"  id="default" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></input>
                    </div>
                </div>
                <button type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    save
                </button>
            </form>
        </div>
    </div>
</div> 
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const store = useStore();
const props = defineProps({ data: String });

const audioRef = ref(new Audio());
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
const volume = ref(1);
const showMenu = ref(false);
const showVolume = ref(false);

const currentSurah = computed(() => store.state.currentSurah);
const startAyaNumber = computed(() => store.getters.getStartAyaNumber);
// watch(startAyaNumber, (val) => {
//   console.log('startAyaNumber updated:', val);
// }, { immediate: true });


const audioList = ref([]);
const currentAudioIndex = ref(0);

// --- تنظیمات ---
const settings = ref({
  qari: [],
  selectedQari: null,
  rangeEnabled: false,
  from: [],
  to: [],
  fromIndex: 0,
  toIndex: 0,
  repeatRange: 1,
  repeatAya: 1,
  speedOptions: [
    { value: 0.5, label: "۰.۵x" },
    { value: 1, label: "۱x" },
    { value: 1.5, label: "۱.۵x" },
    { value: 2, label: "۲x" },
    { value: 2.5, label: "۲.۵x" },
  ],
  speed: 1,
  pauseAfter: false,
  PauseAfterRecitation: 1,
});


// --- ساخت لیست آیات بر اساس currentSurah ---
watch(currentSurah, (newSurah) => {
  if (!newSurah) return;
  const ayat = Array.from({ length: newSurah.aya_count }, (_, i) => ({
    id: i + 1,
    surahName: newSurah.name,
    aya: i + 1,
  }));
  settings.value.from = ayat;
  settings.value.to = ayat;
  settings.value.fromIndex = 0;
  settings.value.toIndex = ayat.length - 1;
}, { immediate: true });

// --- دریافت قاری‌ها ---
const fetchQariList = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/v1/quran/qari/");
    settings.value.qari = res.data;
    settings.value.selectedQari = res.data.length > 1 ? res.data[1] : res.data[0] || null;
    settings.value.speed = settings.value.speedOptions[1]?.value || 1;
  } catch (err) {
    console.error("Error fetching qari list:", err);
  }
};

// --- Watchers ---
watch(volume, (val) => {
  if (audioRef.value) audioRef.value.volume = val;
});

// --- دریافت فایل صوتی سوره ---
// watcher روی startAyaNumber
watch(startAyaNumber, async (val) => {
  if (!currentSurah.value || !settings.value.selectedQari) return;

  // توقف پخش صوت قبلی
  if (audioRef.value && !audioRef.value.paused) {
    audioRef.value.pause();
    isPlaying.value = false;
  }

  // تعیین آیه شروع
  if (val) {
    currentAudioIndex.value = val - 1; // چون ایندکس از 0 شروع می‌شود
  } else {
    currentAudioIndex.value = settings.value.fromIndex;
  }

  // اگر audioList قبلاً لود شده، از همان ایه شروع به پخش کن
  if (audioList.value.length) {
    playNextAudio();
  } else {
    // در غیر این صورت ابتدا فایل صوتی سوره را لود کن
    await fetchSurahAudio();
  }
}, { immediate: true });

// اصلاح fetchSurahAudio
const fetchSurahAudio = async () => {
  if (!currentSurah.value || !settings.value.selectedQari) return;

  try {
    const qariId = settings.value.selectedQari.id;
    const surahId = currentSurah.value.id;

    const res = await axios.get(
      `http://localhost:8000/api/v1/quran/audio/collection/?qari_id=${qariId}&surah_id=${surahId}`
    );
    audioList.value = res.data.audio_urls || [];

    // فقط وقتی startAyaNumber تغییر کرده و watcher فعال نشده، index را تنظیم کن
    if (!currentAudioIndex.value) {
      currentAudioIndex.value = startAyaNumber.value ? startAyaNumber.value - 1 : settings.value.fromIndex;
    }

    if (audioList.value.length) playNextAudio();
  } catch (err) {
    console.error(err);
  }
};


// --- پخش صوت بدون ارور ---
let isAudioPlaying = false;

const playNextAudio = async () => {
  if (!audioRef.value || currentAudioIndex.value >= audioList.value.length) {
    isPlaying.value = false;
    return;
  }

  if (isAudioPlaying) return; // جلوگیری از تداخل
  isAudioPlaying = true;

  try {
    // بروزرسانی آیه جاری
    const currentAyaNumber = currentAudioIndex.value + 1;
    store.dispatch("updateCurrentAya", {
      ayaNumber: currentAyaNumber,
      surahId: currentSurah.value.id,
    });

    audioRef.value.pause();
    audioRef.value.currentTime = 0;
    audioRef.value.src = audioList.value[currentAudioIndex.value];
    audioRef.value.playbackRate = settings.value.speed;

    await audioRef.value.play();
    isPlaying.value = true;

    audioRef.value.onended = async () => {
      if (settings.value.repeatAya > 1) {
        settings.value.repeatAya--;
      } else {
        settings.value.repeatAya = 1;
        currentAudioIndex.value++;
        if (settings.value.rangeEnabled && currentAudioIndex.value > settings.value.toIndex) {
          currentAudioIndex.value = settings.value.fromIndex;
          if (settings.value.repeatRange > 1) {
            settings.value.repeatRange--;
          } else {
            isPlaying.value = false;
            isAudioPlaying = false;
            return;
          }
        }
      }

      if (settings.value.pauseAfter) {
        setTimeout(playNextAudio, settings.value.PauseAfterRecitation * 1000);
      } else {
        playNextAudio();
      }
    };
  } catch (err) {
    console.error("Audio play error:", err);
  } finally {
    isAudioPlaying = false;
  }
};

// --- کنترل پخش ---
const startSurahPlayback = () => fetchSurahAudio();

const clearCurrentSurah = () => {
  // توقف پخش صوت
  if (audioRef.value) {
    audioRef.value.pause();
    audioRef.value.currentTime = 0;
  }

  // ریست کردن وضعیت پلیر
  isPlaying.value = false;
  audioList.value = [];
  currentAudioIndex.value = 0;
  currentTime.value = 0;
  progress.value = 0;

  // پاک کردن سوره جاری در store
  store.dispatch("updateCurrentSurah", null);
  store.dispatch("updateCurrentAya", null);
};


const togglePlay = async () => {
  if (!audioRef.value) return;
  if (!audioList.value.length) {
    await fetchSurahAudio();
    return;
  }
  if (isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
  } else {
    try {
      await audioRef.value.play();
      isPlaying.value = true;
    } catch (err) {
      console.error("Play error:", err);
    }
  }
};

// --- مدیریت زمان ---
const totalDuration = ref(0);
const audioDurations = ref([]);

const loadAudioDurations = async () => {
  audioDurations.value = [];
  totalDuration.value = 0;
  for (let url of audioList.value) {
    const audio = new Audio(url);
    await new Promise((resolve) => {
      audio.addEventListener("loadedmetadata", () => {
        audioDurations.value.push(audio.duration);
        totalDuration.value += audio.duration;
        resolve();
      });
    });
  }
};

watch(audioList, async () => {
  if (audioList.value.length) await loadAudioDurations();
});

const updateTime = () => {
  if (!audioRef.value) return;
  let elapsed = 0;
  for (let i = 0; i < currentAudioIndex.value; i++) {
    elapsed += audioDurations.value[i] || 0;
  }
  currentTime.value = elapsed + (audioRef.value.currentTime || 0);
  progress.value = totalDuration.value
    ? (currentTime.value / totalDuration.value) * 100
    : 0;
};

const setDuration = () => {
  if (audioRef.value && audioDurations.value[currentAudioIndex.value])
    duration.value = audioDurations.value[currentAudioIndex.value];
};

const formatTime = (t) =>
  `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, "0")}`;

const rewind = () => {
  if (audioRef.value) audioRef.value.currentTime = Math.max(audioRef.value.currentTime - 10, 0);
};
const forward = () => {
  if (audioRef.value) audioRef.value.currentTime = Math.min(audioRef.value.currentTime + 10, duration.value);
};

// --- مدیریت منو ---
const toggleMenuTooltip = () => { showMenu.value = !showMenu.value; showVolume.value = false; };
const toggleVolumeTooltip = () => { showVolume.value = !showVolume.value; showMenu.value = false; };

const onDocumentClick = (e) => {
  if (!e.target.closest(".menu-group")) showMenu.value = false;
  if (!e.target.closest(".volume-group")) showVolume.value = false;
};

watch(currentSurah, (newSurah) => {
  if (newSurah && newSurah.automatic_sound) {
    fetchSurahAudio();
  }
});

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
  audioRef.value.volume = volume.value;
  fetchQariList();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
  audioRef.value.pause();
});
</script>



<style scoped>
.audio-player {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 60px;
  background-color: var(--bg-dark);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 999;
  transform: translateY(60px); /* پیش فرض مخفی */
  transition: transform 0.3s ease; /* انیمیشن نرم */
}
.audio-player.active {
  transform: translateY(0px);
}

.progress-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #1e293b;
  cursor: pointer;
}
.progress-bar {
  height: 100%;
  background-color: var(--text-accent);
  transition: width 0.1s linear;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.icon-button {
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.2rem;
  cursor: pointer;
}
.icon-button:hover {
  color: var(--icon-hover);
}

.play-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--text-accent);
  color: var(--bg-darker);
  border: none;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.volume-tooltip,
.menu-tooltip {
  position: absolute;
  bottom: 50px;
  background-color: var(--bg-dark);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem;
  z-index: 10;
}

.volume-group,
.menu-group {
  position: relative;
}

.volume-tooltip input[type='range'] {
  width: 100px;
}

.time-label {
  color: var(--text-muted);
  font-size: 0.8rem;
  width: 50px;
  text-align: center;
  user-select: none;
}

/* --- ریسپانسیو --- */


/* موبایل خیلی کوچک (زیر 400px) */
@media (max-width: 400px) {
  .audio-player {
    /* flex-direction: column; */
    height: auto;
    gap: 0.4rem;
    padding: 0.35rem;
  }
  .controls {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .play-button {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
  .icon-button {
    font-size: 0.85rem;
  }
  .time-label {
    font-size: 0.65rem;
    width: auto;
  }
  .progress-container {
    height: 3px;
  }
}

/* موبایل معمولی */
@media (min-width: 401px) and (max-width: 576px) {
  .audio-player {
    /* flex-direction: column; */
    height: auto;
    gap: 0.6rem;
    padding: 0.5rem;
  }
  .controls {
    gap: 0.7rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .play-button {
    width: 34px;
    height: 34px;
    font-size: 1.1rem;
  }
  .icon-button {
    font-size: 0.95rem;
  }
  .time-label {
    font-size: 0.7rem;
    width: auto;
  }
  .progress-container {
    height: 3px;
  }
}

/* تبلت */
@media (min-width: 577px) and (max-width: 768px) {
  .audio-player {
    padding: 0.5rem 1rem;
    height: auto;
    gap: 0.8rem;
  }
  .controls {
    gap: 1rem;
  }
  .play-button {
    width: 38px;
    height: 38px;
    font-size: 1.3rem;
  }
  .icon-button {
    font-size: 1.1rem;
  }
  .volume-tooltip-width-for-panel-setting {
    width: 300px;
    transform: translateX(80px);
  }
}

/* لپ‌تاپ */
@media (min-width: 769px) and (max-width: 992px) {
  .audio-player {
    padding: 0.5rem 1rem;
  }
  .controls {
    gap: 1rem;
  }
  .play-button {
    width: 40px;
    height: 40px;
  }
  .volume-tooltip-width-for-panel-setting {
    width: 320px;
    transform: translateX(120px);
  }
}

/* دسکتاپ بزرگ */
@media (min-width: 1200px) {
  .audio-player {
    padding: 0 2rem;
  }
  .controls {
    gap: 1.5rem;
  }
  .play-button {
    width: 42px;
    height: 42px;
    font-size: 1.5rem;
  }
  .icon-button {
    font-size: 1.3rem;
  }
  .volume-tooltip-width-for-panel-setting {
    width: 350px;
    transform: translateX(143px);
  }
}

.settings-panel {
  background-color: var(--bg-dark);
  color: var(--text-light);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem;
  z-index: 10;
}

.form-select,
.form-input {
  background-color: var(--bg-dark);
  color: var(--text-light);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.form-select:focus,
.form-input:focus {
  outline: none;
}

.translation-box {
  background-color: rgba(255, 255, 255, 0.025);
  border: 1px solid;
  border-radius: 0.50rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}
.border-green {
  border-color: var(--green);
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