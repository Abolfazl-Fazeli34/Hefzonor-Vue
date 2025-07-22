<template>
  <div class="audio-player">
    <!-- <audio controls :src="data"></audio> -->

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
        <div class="menu-tooltip" v-if="showMenu">
          <p class="text-light m-0 small">تنظیمات صوت</p>
          <label class="form-check-label small text-muted">
            <input type="checkbox" class="form-check-input me-1" /> تقویت باس
          </label>
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
          <input type="range" min="0" max="1" step="0.01" v-model="volume" />
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

<script>
export default {
  name: 'AudioPlayer',
  props: {
    data: String,
    // selectedWord: Array,
  },
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      volume: 1,
      showMenu: false,
      showVolume: false,
      audioSrc: ''  // مقدار اولیه خالی
    };
  },
  mounted() {
    document.addEventListener('click', this.onDocumentClick);
    this.$refs.audioRef.volume = this.volume;
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  },
  watch: {
    data: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.audioSrc = newVal;
          this.reloadAudio();
        }
      }
    },
    volume(val) {
      if (this.$refs.audioRef) {
        this.$refs.audioRef.volume = val;
      }
    }
  },
  methods: {
    reloadAudio() {
      const audio = this.$refs.audioRef;
      if (audio) {
        audio.pause();
        audio.load();
        this.isPlaying = false;
        this.currentTime = 0;
        this.progress = 0;
      }
    },
    updateTime() {
      const audio = this.$refs.audioRef;
      this.currentTime = audio.currentTime;
      this.progress = this.duration ? (this.currentTime / this.duration) * 100 : 0;
    },
    setDuration() {
      this.duration = this.$refs.audioRef.duration;
    },
    togglePlay() {
      const audio = this.$refs.audioRef;
      if (audio.paused) {
        audio.play();
        this.isPlaying = true;
      } else {
        audio.pause();
        this.isPlaying = false;
      }
    },
    rewind() {
      const audio = this.$refs.audioRef;
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    },
    forward() {
      const audio = this.$refs.audioRef;
      audio.currentTime = Math.min(audio.currentTime + 10, this.duration);
    },
    seek(event) {
      const audio = this.$refs.audioRef;
      const width = event.currentTarget.clientWidth;
      const clickX = event.offsetX;
      audio.currentTime = (clickX / width) * this.duration;
    },
    formatTime(time) {
      const m = Math.floor(time / 60);
      const s = Math.floor(time % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    },
    toggleMenuTooltip() {
      this.showMenu = !this.showMenu;
      this.showVolume = false;
    },
    toggleVolumeTooltip() {
      this.showVolume = !this.showVolume;
      this.showMenu = false;
    },
    onDocumentClick(e) {
      if (!e.target.closest('.menu-group')) this.showMenu = false;
      if (!e.target.closest('.volume-group')) this.showVolume = false;
    },
    handleWordClick(word) {
      this.selectedWord = word;
    }
  }
};
</script>


<style scoped>
.audio-player {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 70px;
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
  width: 45px;
  height: 45px;
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
  white-space: nowrap;
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
</style>
