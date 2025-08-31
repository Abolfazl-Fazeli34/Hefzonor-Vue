<template>
  <div class="audio-player">
    <!-- نوار پیشرفت -->
    <div class="progress-container" @click="seek">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- زمان فعلی -->
    <span class="time-label">{{ formatTime(currentTime) }}</span>

    <!-- کنترل‌ها -->
    <div class="controls">
      <!-- تنظیمات -->
      <div class="menu-group">
        <button @click="toggleMenuTooltip" class="icon-button">
          <i class="fas fa-ellipsis-h"></i>
        </button>

        <!-- پنل تنظیمات -->
        <div class="volume-tooltip volume-tooltip-width-for-panel-setting" v-if="showMenu">
          <div class="translation-box border-green">
            <h6 class="panel-title text-yellow-400 font-semibold mb-2">تنظیمات صوت</h6>

            <!-- انتخاب قاری -->
            <div class="form-group flex flex-col gap-1 w-full">
              <label class="form-label">انتخاب قاری:</label>
              <select v-model="settings.qari[0]" class="form-select flex-1">
                <option v-for="(q, index) in settings.qari" :key="index">{{ q }}</option>
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
                <div class="display flex items-center gap-2">
                  <label class="w-12">از:</label>
                  <select v-model="settings.from[0]" class="form-select flex-1">
                    <option v-for="(f, index) in settings.from" :key="index">{{ f }}</option>
                  </select>
                </div>
                <div class="display flex items-center gap-2">
                  <label class="w-12">تا:</label>
                  <select v-model="settings.to[0]" class="form-select flex-1">
                    <option v-for="(t, index) in settings.to" :key="index">{{ t }}</option>
                  </select>
                </div>

                <!-- تکرار محدوده -->
                <div class="display flex flex-col gap-1">
                  <label style="width: 150px;">تکرار محدوده:</label>
                  <input type="number" min="1" v-model="settings.repeatRange" class="form-input" />
                </div>

                <!-- تکرار آیه -->
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
              <select v-model="settings.speed" class="form-select flex-1">
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
                v-model="settings.pauseDuration"
                type="number"
                min="1"
                class="form-input"
                placeholder="ثانیه"
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
    <span class="time-label">{{ formatTime(duration) }}</span>

    <!-- پلیر -->
    <audio
      ref="audioRef"
      :src="data"
      @timeupdate="updateTime"
      @loadedmetadata="setDuration"
    ></audio>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

// --- Props ---
const props = defineProps({
  data: String,
  // selectedWord: Array,
});

// --- Refs & State ---
const audioRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
const volume = ref(1);
const showMenu = ref(false);
const showVolume = ref(false);
const audioSrc = ref("");


const settings = ref({
  qari: ["مکارم (کبیری) (ترجمه صوتی)", "عبدالباسط", "منشاوی"],
  rangeEnabled: false,
  from: ["حمد (۱)", "فاتحه (۱)", "بقره (۱)"],
  to: ["حمد (۱)", "فاتحه (۱)", "بقره (۱)"],
  repeatRange: 2,
  repeatAya: 1,
  speed: 1,
  speedOptions: [
    { value: 0.5, label: "۰.۵x" },
    { value: 1, label: "۱x" },
    { value: 1.5, label: "۱.۵x" },
    { value: 2, label: "۲x" },
  ],
  pauseAfter: false,
  pauseDuration: 3,
});

// --- Watchers ---
watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      audioSrc.value = newVal;
      reloadAudio();
    }
  },
  { immediate: true }
);

watch(
  () => volume.value,
  (val) => {
    if (audioRef.value) {
      audioRef.value.volume = val;
    }
  }
);

// --- Methods ---
const reloadAudio = () => {
  const audio = audioRef.value;
  if (audio) {
    audio.pause();
    audio.load();
    isPlaying.value = false;
    currentTime.value = 0;
    progress.value = 0;
  }
};

const updateTime = () => {
  const audio = audioRef.value;
  currentTime.value = audio.currentTime;
  progress.value = duration.value
    ? (currentTime.value / duration.value) * 100
    : 0;
};

const setDuration = () => {
  duration.value = audioRef.value.duration;
};

const togglePlay = () => {
  const audio = audioRef.value;
  if (audio.paused) {
    audio.play();
    isPlaying.value = true;
  } else {
    audio.pause();
    isPlaying.value = false;
  }
};

const rewind = () => {
  const audio = audioRef.value;
  audio.currentTime = Math.max(audio.currentTime - 10, 0);
};

const forward = () => {
  const audio = audioRef.value;
  audio.currentTime = Math.min(audio.currentTime + 10, duration.value);
};

const seek = (event) => {
  const audio = audioRef.value;
  const width = event.currentTarget.clientWidth;
  const clickX = event.offsetX;
  audio.currentTime = (clickX / width) * duration.value;
};

const formatTime = (time) => {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const toggleMenuTooltip = () => {
  showMenu.value = !showMenu.value;
  showVolume.value = false;
};

const toggleVolumeTooltip = () => {
  showVolume.value = !showVolume.value;
  showMenu.value = false;
};

const onDocumentClick = (e) => {
  if (!e.target.closest(".menu-group")) showMenu.value = false;
  if (!e.target.closest(".volume-group")) showVolume.value = false;
};

const handleWordClick = (word) => {
  console.log("Clicked word:", word);
};

// --- Lifecycle Hooks ---
onMounted(() => {
  document.addEventListener("click", onDocumentClick);
  if (audioRef.value) audioRef.value.volume = volume.value;
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
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
  /* transform: translateY(71px); */
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

@media (max-width: 576px) {
  .audio-player {
    flex-direction: column;
    height: auto;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .controls {
    gap: 0.8rem;
  }

  .time-label {
    font-size: 0.7rem;
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
  box-sizing: border-box;
  width: 100%;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  /* border-color: var(--text-accent); */
}

.menu-tooltip,
.volume-tooltip {
  position: absolute;
  bottom: 50px;
  background-color: var(--bg-dark);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem;
  z-index: 10;
  white-space: normal;
}

.volume-tooltip-width-for-panel-setting{
  width: 350px;
  transform: translateX(143px);
}

.display{
      display: flex;
    align-items: center;
    justify-content: space-between;
}

/* ترجمه‌ها */
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
</style>
