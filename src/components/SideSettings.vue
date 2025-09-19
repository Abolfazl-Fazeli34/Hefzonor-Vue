<template>
  <div class="custom-offcanvas left" :class="{ show: isOpen }" ref="menuRef">
    <!-- هدر مودال -->
    <div class="offcanvas-header">
      <h5 class="title">لیست آیه‌ها</h5>
      <button class="btn-close" @click="store.commit('setIsOpen', false)">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <!-- نوار جستجو -->
    <div class="search-box">
      <input
        type="text"
        class="form-control"
        placeholder="جستجوی آیه..."
        v-model="searchQuery"
      />
    </div>

    <!-- لیست آیه‌ها -->
    <div class="offcanvas-body custom-scrollbar">
      <ul class="list-group list-group-flush">
        <li
          v-for="aya in filteredAyahs"
          :key="aya.id"
          class="list-group-item d-flex align-items-center justify-content-between list-hover"
        >
          <div class="d-flex flex-column">
            <span class="aya-text">{{ aya.verse_number }} - {{ aya.text }}</span>
            <small class="translation" v-if="settings.showTranslation">
              {{ aya.translation }}
            </small>
          </div>

          <!-- آیکون‌ها -->
          <div class="icons d-flex gap-2">
            <i class="bi bi-eye-fill" @click="toggleVisibility(aya)" title="نمایش/مخفی"></i>
            <i class="bi bi-play-fill" @click="playAudio(aya)" title="پخش صوت"></i>
            <i class="bi bi-share-fill" @click="shareAya(aya)" title="اشتراک‌گذاری"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const searchQuery = ref('')

// گرفتن مقادیر از store
const isOpen = ref(null)
const ayahs = ref(null)
const settings = ref(null)

// const isOpen = computed(() => store.state.isOpen)
// const ayahs = computed(() => store.state.ayahs)
// const settings = computed(() => store.state.settings)

// فیلتر آیه‌ها
const filteredAyahs = computed(() => {
  if (!searchQuery.value) return ayahs.value
  return ayahs.value.filter(aya =>
    aya.text.includes(searchQuery.value) ||
    (aya.translation && aya.translation.includes(searchQuery.value))
  )
})

// توابع
const toggleVisibility = (aya) => {
  store.commit('toggleAyaVisibility', aya.id) // پیشنهاد بهتر: mutation
}
const playAudio = (aya) => console.log('Play audio for:', aya.verse_number)
const shareAya = (aya) => console.log('Share aya:', aya.verse_number)
</script>

<style scoped>
.custom-offcanvas.left {
  position: fixed;
  top: 110;
  left: -320px;
  width: 320px;
  height: 100vh;
  background-color: var(--bg-dark, #1e1e1e);
  color: white;
  z-index: 1000;
  transition: left 0.3s ease-in-out;
  overflow-y: auto;
  border-right: 1px solid var(--border-color, #333);
  display: flex;
  flex-direction: column;
}

.custom-offcanvas.left.show {
  left: 0;
}

.offcanvas-header {
  flex-shrink: 0;
  padding: 1rem;
  background-color: var(--bg-dark, #1e1e1e);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.offcanvas-header .title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.btn-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.search-box {
  padding: 0.75rem 1rem;
  background: var(--bg-dark, #1e1e1e);
  border-bottom: 1px solid #333;
}

.offcanvas-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.list-group-item {
  background: transparent;
  border: none;
  padding: 0.75rem 0;
  color: #fff;
}

.list-hover:hover {
  background-color: rgba(0, 188, 212, 0.15);
  border-radius: 6px;
}

.aya-text {
  font-weight: 500;
  font-size: 1rem;
}

.translation {
  font-size: 0.8rem;
  color: var(--text-muted, #aaa);
}

.icons i {
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--accent, #00bcd4);
  transition: transform 0.2s ease, color 0.2s ease;
}
.icons i:hover {
  transform: scale(1);
  color: #fff;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
