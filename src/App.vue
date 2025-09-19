<template>
 <!-- class="bg-white text-black dark:bg-gray-900 dark:text-white" -->
  <div dir="rtl" lang="fa">

    <!-- Header -->
    <HeaderComponent />

    <!-- Side Menu -->
    <SideMenu />

    <!-- Side Settings -->
    <SideSettings />

    <!-- <GoToButton/> -->
    
    <!-- Main Content via router -->
    <!-- <router-view :id_sure="id_sure" :filtered-items="filteredItems" :selectedWord="selectedWord" @send-audio-data="handleAudioData" @wordClicked="handleWordClick" /> -->
    <router-view v-slot="{ Component }">
      <component
        :is="Component"
        :id_sure="id_sure"
        :filtered-items="filteredItems"
        :selected-word="selectedWord"
        @send-audio-data="handleAudioData"
        @wordClicked="handleWordClick"
      />
    </router-view>


    <!-- Audio Player -->
    <AudioPlayer :data="audioDataFromChild" :selectedWord="selectedWord"/>

  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import InfoBar from './components/InfoBar.vue'
import SideMenu from './components/SideMenu.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import TabbedContent from './components/TabbedContent.vue'
import QuranDetails from './components/QuranDetails.vue'
import SideSettings from './components/SideSettings.vue'
import GoToButton from './components/GoToButton.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    InfoBar,
    SideMenu,
    AudioPlayer,
    TabbedContent,
    QuranDetails,
    SideSettings,
    GoToButton
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
  color: var(--text-light);
  /* @apply dark:bg-gray-900 */
}


</style>
