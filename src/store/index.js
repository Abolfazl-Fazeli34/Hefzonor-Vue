// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    currentSurah: null,  // اطلاعات سوره انتخاب شده
    currentAya: null,    // شماره آیه جاری
  },
  mutations: {
    setCurrentSurah(state, surah) {
      state.currentSurah = surah;
    },
    setCurrentAya(state, aya) {
      state.currentAya = aya;
    },
  },
  actions: {
    updateCurrentSurah({ commit }, surah) {
      commit('setCurrentSurah', surah);
    },
    updateCurrentAya({ commit }, aya) {
      commit('setCurrentAya', aya);
    },
  },
  getters: {
    getCurrentSurah: (state) => state.currentSurah,
    getCurrentAya: (state) => state.currentAya,
  },
});
