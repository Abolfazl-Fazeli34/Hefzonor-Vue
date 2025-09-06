// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    currentSurah: null,  // اطلاعات سوره انتخاب شده
    currentAya: null,    // شماره آیه جاری
    startAyaNumber: null,
    isOpen: false,
    ayahs: [
    //   {
    //   id: 1,
    //   verse_number: 1,
    //   text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    //   translation: "به نام خداوند بخشنده مهربان"
    // },
    // {
    //   id: 2,
    //   verse_number: 2,
    //   text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    //   translation: "ستایش مخصوص خداوند، پروردگار جهانیان است"
    // },
    // {
    //   id: 3,
    //   verse_number: 3,
    //   text: "الرَّحْمَٰنِ الرَّحِيمِ",
    //   translation: "بخشنده مهربان"
    // },
    // {
    //   id: 4,
    //   verse_number: 4,
    //   text: "مَالِكِ يَوْمِ الدِّينِ",
    //   translation: "مالک روز جزا"
    // },
    // {
    //   id: 5,
    //   verse_number: 5,
    //   text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    //   translation: "تنها تو را می‌پرستیم و تنها از تو یاری می‌جوییم"
    // },
    ],
    settings: {
      showTranslation: true,
      fontSize: '16px'
    }
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
    setIsOpen(state, payload) {
      state.isOpen = payload
    },
    setAyahs(state, payload) {
      state.ayahs = payload
    },
    setSettings(state, payload) {
      state.settings = { ...state.settings, ...payload }
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
    }
  },
  getters: {
    getCurrentSurah: (state) => state.currentSurah,
    getCurrentAya: (state) => state.currentAya,
    getStartAyaNumber: (state) => state.startAyaNumber
  },
});
