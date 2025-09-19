// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    currentSurah: null,  // اطلاعات سوره انتخاب شده
    currentAya: null,    // شماره آیه جاری
    startAyaNumber: null,
    isOpen: false,
    ayahs: [],
    settings: {
      showTranslation: true,
      fontSize: '16px'
    },
    theme: localStorage.getItem('theme') || 'light'
  },
  mutations: {
    setCurrentSurah(state, surah) {
      state.currentSurah = surah;
    },
    setCurrentAya(state, aya) {
      state.currentAya = aya;
    },
    setStartAyaNumber(state, number) { 
      state.startAyaNumber = number;
    },
    toggleIsOpen(state) {
      state.isOpen = !state.isOpen;
    },
    setIsOpen(state, val) {  
      state.isOpen = val;
    },
    setAyahs(state, payload) {
      state.ayahs = payload
    },
    setSettings(state, payload) {
      state.settings = { ...state.settings, ...payload }
    },
    setTheme(state, theme) { 
      state.theme = theme 
      localStorage.setItem('theme', theme)
    }
  },
  actions: {
    updateCurrentSurah({ commit }, surah) {
      commit('setCurrentSurah', surah);
    },
    updateCurrentAya({ commit }, aya) {
      commit('setCurrentAya', aya);
    },
    updateStartAyaNumber({ commit }, number) {  // ← اضافه شد
      commit('setStartAyaNumber', number);
    },
    updateTheme({ commit }, theme) { commit('setTheme', theme) }
  },
  getters: {
    getCurrentSurah: (state) => state.currentSurah,
    getCurrentAya: (state) => state.currentAya,
    getStartAyaNumber: (state) => state.startAyaNumber,
    getTheme: (state) => state.theme
  },
});
