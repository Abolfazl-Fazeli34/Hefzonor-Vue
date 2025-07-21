<template>

  <div dir="rtl" lang="fa">
    <!-- Header -->
    <HeaderComponent />

    <!-- Info Bar -->
    <InfoBar @toggle-menu="toggleMenu" />

    <!-- Side Menu -->
    <SideMenu :isOpen="isMenuOpen" @close="closeMenu" @selectSurah="handleSurahSelected" />

    <!-- Main Content -->
    <TabbedContent  :id_sure="id_sure" @send-audio-data="handleAudioData" :filtered-items="filteredItems" @wordClicked="handleWordClick"/>

    <!-- Audio Player -->
    <AudioPlayer :data="audioDataFromChild" />
    <router-view />
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import InfoBar from './components/InfoBar.vue'
import SideMenu from './components/SideMenu.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import TabbedContent from './components/TabbedContent.vue'


export default {
  name: 'App',
  components: {
    HeaderComponent,
    InfoBar,
    SideMenu,
    AudioPlayer,
    TabbedContent
  },
  data() {
    return {
      isMenuOpen: false,
      id_sure: 1, 
      audioDataFromChild: '',
      selectedWord: null
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    handleSurahSelected(sure) {
      this.id_sure = sure;
    },
    handleAudioData(data) {
      this.audioDataFromChild = data;
      console.log("دریافت صوت:", data);
    },
    handleWordClick(word) {
      console.log('کلمه کلیک شده:', word);
      this.selectedWord = word;
    }
  }
}
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css";
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');

body {
  font-family: 'Vazirmatn', sans-serif;
  background-color: var(--bg-darker);
  color: var(--text-light);
}
</style>
