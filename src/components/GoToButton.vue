<template>
<!-- دکمه ثابت -->
<button 
  class="btn fixed-btn d-flex flex-column align-items-center justify-content-center"
  @click="openGoToModal"
>
  <i class="fas fa-book-open fa-2x"></i>
  <small class="mt-1">برو به</small>
</button>


<!-- مودال برو به -->
<div 
  class="modal fade" 
  id="goToModal" 
  tabindex="-1" 
  aria-labelledby="goToModalLabel" 
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content" style="background-color: var(--bg-dark); color: #fff;">
      
      <!-- هدر -->
      <div class="modal-header" style="border: none;">
        <h5 class="modal-title" id="goToModalLabel">آیه یا سوره مدنظر خود را انتخاب کنید</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>

      <!-- تب‌ها -->
      <ul class="nav nav-tabs justify-content-center gap-2">
        <li class="nav-item" v-for="tab in ['verse','page','juz','hizb']" :key="tab">
          <button 
            class="nav-link" 
            :class="{ active: activeGoToTab === tab }"
            @click="activeGoToTab = tab"
          >
            {{ tabLabels[tab] }}
          </button>
        </li>
      </ul>

      <!-- بدنه -->
      <div class="modal-body">

        <!-- تب آیه -->
        <div v-if="activeGoToTab === 'verse'">
          <div class="mb-3">
            <label class="form-label">انتخاب سوره</label>
            <select v-model="selectedSurah" class="form-select">
              <option disabled value="">-- انتخاب سوره --</option>
              <option v-for="s in surahs" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">انتخاب آیه</label>
            <select v-model="selectedVerse" class="form-select" :disabled="!selectedSurah">
              <option disabled value="">-- انتخاب آیه --</option>
              <option v-for="n in verseCount" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>

        <!-- تب صفحه -->
        <div v-if="activeGoToTab === 'page'">
          <label class="form-label">شماره صفحه (۱ تا ۶۰۴)</label>
          <input 
            type="number" 
            v-model.number="selectedPage" 
            min="1" 
            max="604" 
            class="form-select"
          >
        </div>

        <!-- تب جزء -->
        <div v-if="activeGoToTab === 'juz'">
          <label class="form-label">شماره جزء (۱ تا ۳۰)</label>
          <input 
            type="number" 
            v-model.number="selectedJuz" 
            min="1" 
            max="30" 
            class="form-select"
          >
        </div>

        <!-- تب حزب -->
        <div v-if="activeGoToTab === 'hizb'">
          <label class="form-label">شماره حزب (۱ تا ۶۰)</label>
          <input 
            type="number" 
            v-model.number="selectedHizb" 
            min="1" 
            max="60" 
            class="form-select"
          >
        </div>
      </div>

      <!-- فوتر -->
      <div class="modal-footer" dir="ltr">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">انصراف</button>
        <button type="button" class="btn btn-primary" @click="goToAction">برو</button>
      </div>

    </div>
  </div>
</div>

</template>


<script setup>
import { ref, watch, onMounted } from 'vue';
import { Modal } from "bootstrap";
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeGoToTab = ref("verse");
const selectedSurah = ref("");
const selectedVerse = ref("");
const selectedPage = ref(1);
const selectedJuz = ref(1);
const selectedHizb = ref(null);

const tabLabels = {
  verse: "آیه",
  page: "صفحه",
  juz: "جزء",
  hizb: "حزب"
};

// لیست سورها و تعداد آیه‌ها
const surahs = ref([]);
const verseCount = ref(0);

// گرفتن سورها از API
const fetchSurahs = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/v1/quran/surah/verse/list/');
    // فیلتر کردن فقط نام‌های اصلی سوره (type: 2) و گرفتن آخرین occurrence برای verse_count
    const filtered = res.data.filter(item => item.type === 2);
    
    // ساخت آرایه سورها با id و name و verse_count
    const surahMap = {};
    filtered.forEach(item => {
      surahMap[item.surah_id] = {
        id: item.surah_id,
        name: item.arabic_text,
        verse_count: item.verse_count
      };
    });
    surahs.value = Object.values(surahMap);
  } catch (error) {
    console.error("خطا در دریافت سورها:", error);
  }
};

// وقتی سوره انتخاب شد، تعداد آیات اون سوره تنظیم شود
watch(selectedSurah, (newVal) => {
  const surah = surahs.value.find(s => s.id == newVal);
  verseCount.value = surah ? surah.verse_count : 0;
  selectedVerse.value = ""; // reset آیه
});

// باز کردن مودال
const openGoToModal = () => {
  const modalEl = document.getElementById("goToModal");
  const modal = Modal.getOrCreateInstance(modalEl);
  modal.show();
};

// روت کردن
const goToAction = () => {
  if (activeGoToTab.value === "verse") {
    if (!selectedSurah.value || !selectedVerse.value) return;
    router.push({
      name: 'quran-surah',
      params: {
        surahno: selectedSurah.value,
        verse_number: selectedVerse.value
      },
      query: { aya: selectedVerse.value }
    });
  } else if (activeGoToTab.value === "page") {
    router.push({
      name: 'quran-page',
      params: { pageno: selectedPage.value },
      query: { page: selectedPage.value }
    });
  } else if (activeGoToTab.value === "juz") {
    router.push({
      name: 'quran-juz',
      params: { juzno: selectedJuz.value },
      query: { juz: selectedJuz.value }
    });
  } else if (activeGoToTab.value === "hizb") {
    router.push({
      path: `/quran/hizb/${selectedHizb.value}`,
      query: { hizb: selectedHizb.value }
    });
  }

  // بستن مودال
  const modalEl = document.getElementById("goToModal");
  const modal = Modal.getInstance(modalEl);
  modal?.hide();
};

// بارگذاری سورها هنگام mount
onMounted(() => {
  fetchSurahs();
});
</script>


<style scoped>
/* دکمه ثابت "برو به" */
.fixed-btn {
  position: fixed;
  left: 0;
  top: 35%; /* دسکتاپ */
  transform: translateY(-50%);
  z-index: 1050;
  border-radius: 0 12px 12px 0;
  background-color: var(--bg-darker);
  color: var(--text-light);
  font-weight: bold;
  padding: 5px 10px;
  width: 60px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.fixed-btn i {
  font-size: 28px;
}

.fixed-btn small {
  font-size: 12px;
}

.fixed-btn:hover {
  background-color: #0054a1;
}

/* مودال سفارشی */
.modal-content {
  background-color: var(--bg-dark);
  color: #fff;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  max-width: 500px;
}

.modal-header {
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-dark-light);
}

.modal-title {
  color: #f1f1f1;
  font-weight: bold;
  font-size: 1.2rem;
}

.modal-body {
  background-color: var(--bg-dark);
  color: #ddd;
}

.modal-body label {
  color: #bbb;
  font-size: 0.9rem;
}

.modal-body .form-select,
.modal-body input[type="number"] {
  background-color: var(--bg-dark);
  color: #fff;
  border: 1px solid var(--border-color);
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.modal-body .form-select:focus,
.modal-body input[type="number"]:focus {
  background-color: var(--bg-dark-light);
  border-color: #0dcaf0;
  box-shadow: 0 0 0 0.25rem rgba(13, 202, 240, 0.25);
}

.modal-footer {
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-dark-light);
}

.modal-footer .btn {
  border-radius: 6px;
  font-size: 0.9rem;
  padding: 0.35rem 0.8rem;
}

/* تب‌ها داخل مودال */
.nav-tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.nav-tabs .nav-link {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  /* border-radius: 10px; */
  /* background-color: var(--bg-dark-light); */
  color: #fff;
  transition: all 0.2s ease;
}

.nav-tabs .nav-link.active {
  /* background-color: #00bfff; */
  color: #000;
  /* font-weight: bold; */
}

.nav-tabs .nav-link:hover {
  /* background-color: rgba(0, 191, 255, 0.3); */
  color: #000;
}

/* ریسپانسیو موبایل */
@media (max-width: 768px) {
  /* دکمه ثابت کمی بالاتر */
  .fixed-btn {
    top: 25%;
    width: 50px;
    height: 70px;
    padding: 4px 8px;
  }

  .fixed-btn i {
    font-size: 24px;
  }

  .fixed-btn small {
    font-size: 10px;
  }

  /* مودال */
  .modal-content {
    max-width: 90%;
    margin: 1rem;
  }

  .modal-title {
    font-size: 1rem;
  }

  .modal-body label {
    font-size: 0.85rem;
  }

  .modal-body .form-select,
  .modal-body input[type="number"] {
    font-size: 0.85rem;
    padding: 0.3rem 0.45rem;
  }

  .modal-footer .btn {
    font-size: 0.85rem;
    padding: 0.3rem 0.7rem;
  }

  .nav-tabs .nav-link {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}

@media (max-width: 576px) {
  .fixed-btn {
    top: 20%;
    width: 45px;
    height: 65px;
    padding: 3px 6px;
  }

  .fixed-btn i {
    font-size: 22px;
  }

  .fixed-btn small {
    font-size: 9px;
  }

  .modal-body label,
  .modal-body .form-select,
  .modal-body input[type="number"],
  .modal-footer .btn,
  .nav-tabs .nav-link {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
}



</style>
