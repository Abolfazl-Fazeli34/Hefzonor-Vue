<template>
  <section :class="['info-bar', { 'fixed-info-bar': isFixed }]" ref="infoBarRef">
    <div class="sura-name">
      <button class="btn text-light" @click="toggleMenu">
        <i class="fas fa-bars"></i>
      </button>
      <span>Al-Ma'idah</span>
    </div>
    <div class="details">Juz 6 / Hizb 11 - Page 106</div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

// دسترسی به store
const store = useStore();

const isFixed = ref(false);

const infoBarRef = ref(null);

const toggleMenu = () => {
  store.commit('toggleIsOpen');
};

const handleScroll = () => {
  const offsetTop = infoBarRef.value ? infoBarRef.value.offsetTop : 0;
  isFixed.value = window.scrollY > offsetTop;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* پایه */
.info-bar {
  --top-offset: 0px; /* در صورت وجود هدر فیکس بالاتر می‌توانید این متغیر را تنظیم کنید */
  background-color: var(--bg-dark);
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 998;
  transition: all 0.22s ease;
  box-sizing: border-box;
  min-height: 48px; /* حداقل ارتفاع برای پایداری چیدمان */
  gap: 1rem;
}

/* وقتی فیکس می‌شود */
.fixed-info-bar {
  position: fixed;
  top: var(--top-offset);
  right: 0;
  left: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  backdrop-filter: blur(4px); /* ملایم، ظاهر را بهتر می‌کند (اختیاری) */
}

/* بخش نام سوره */
.sura-name {
  display: flex;
  align-items: center;
  gap: clamp(0.35rem, 0.9vw, 0.6rem);
  font-size: clamp(0.95rem, 2.2vw, 1.1rem);
  font-weight: 700;
  color: var(--text-light);
  min-width: 0; /* ضروری برای text-overflow در فلکس‌باکس */
  line-height: 1;
}

/* دکمه منو (آیکون) داخل سوره */
.sura-name .btn {
  background: transparent;
  border: none;
  color: var(--text-light);
  padding: 0.28rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: clamp(1rem, 2.4vw, 1.15rem);
  min-width: 40px;
  min-height: 40px; /* هدف لمسی */
  line-height: 1;
}
.sura-name .btn:focus {
  outline: 2px solid rgba(255,255,255,0.06);
  outline-offset: 2px;
}

/* متن سوره — اجازهٔ بریده شدن با سه‌نقطه در فضاهای کوچک */
.sura-name span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
}

/* جزئیات سمت راست */
.details {
  font-size: clamp(0.68rem, 1.4vw, 0.8rem);
  color: var(--text-muted);
  flex: 0 0 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 1rem;
  min-width: 0; /* برای حفظ ellipsis در فلکس */
}

/* --- ریسپانسیو دقیق: نقاط شکست متعدد --- */

/* دسکتاپ بزرگ (1200+) */
@media (min-width: 1200px) {
  .info-bar { padding: 0.6rem 2rem; min-height: 52px; }
  .sura-name { font-size: clamp(1rem, 1.2vw, 1.15rem); }
  .sura-name .btn { min-width: 44px; min-height: 44px; font-size: 1.2rem; }
  .details { font-size: 0.85rem; }
}

/* لپ‌تاپ (992 - 1199) */
@media (min-width: 992px) and (max-width: 1199px) {
  .info-bar { padding: 0.52rem 1.6rem; }
  .sura-name .btn { min-width: 40px; min-height: 40px; }
}

/* تبلت (768 - 991) */
@media (min-width: 768px) and (max-width: 991px) {
  .info-bar { padding: 0.48rem 1.2rem; gap: 0.8rem; }
  .sura-name { gap: 0.45rem; font-size: clamp(0.95rem, 1.9vw, 1.05rem); }
  .details { font-size: 0.76rem; margin-left: 0.8rem; }
}

/* موبایل معمولی (576 - 767) — جمع‌تر، اما در یک ردیف */
@media (min-width: 576px) and (max-width: 767px) {
  .info-bar { padding: 0.42rem 0.9rem; gap: 0.65rem; min-height: 44px; }
  .sura-name .btn { min-width: 38px; min-height: 38px; font-size: 1.05rem; }
  .sura-name span { font-size: 0.95rem; }
  .details { font-size: 0.72rem; margin-left: 0.6rem; }
}

/* موبایل کوچک (<=575) — اگر فضا کم شد: امکان wrap و stack */
@media (max-width: 575px) {
  .info-bar {
    padding: 0.36rem 0.6rem;
    gap: 0.4rem;
    min-height: auto;
  }

  /* اجازهٔ اسکرول افقی برای متن (در صورتی که هنوز نیاز باشد) */
  .sura-name { flex: 1 1 auto; min-width: 0; }

  .sura-name .btn { min-width: 36px; min-height: 36px; font-size: 0.95rem; padding: 0.18rem; }
  .sura-name span { font-size: 0.9rem; }

  .details {
    flex: 0 0 auto;
    font-size: 0.68rem;
    margin-left: 0.5rem;
    max-width: 45%;
  }

  /* اگر متن‌ها فشار آوردند، اجازه می‌دهیم سطر بشکنند (stack) */
  /* اما تنها زمانی که واقعا لازم باشد، برای حفظ ظاهر دلخواه */
  @supports (display: flex) {
    /* keep default single-row unless super narrow */
  }
}

/* موبایل خیلی کوچک (<=420) — بیشترین جمع‌شدن و تبدیل به ستون */
@media (max-width: 420px) {
  .info-bar {
    /* flex-direction: column; */
    align-items: center;
    padding: 0.28rem 0.45rem;
    justify-content: space-between;
    gap: 0.18rem;
  }
  .sura-name {
    width: 100%;
    justify-content: flex-start;
    gap: 0.35rem;
  }
  .sura-name .btn { min-width: 34px; min-height: 34px; font-size: 0.88rem; }
  .sura-name span { font-size: 0.86rem; max-width: calc(100% - 46px); } /* leave room for button */
  .details {
    width: 100%;
    margin-left: 0;
    font-size: 0.64rem;
    color: var(--text-muted);
    white-space: normal; /* اجازه می‌دهد در دو سطر بیاید */
    overflow: visible;
    text-overflow: clip;
    text-align: end;
  }
  .fixed-info-bar { padding-top: env(safe-area-inset-top); } /* آیفون نُتچ */
}

/* نرمی در فوکوس برای دسترس‌پذیری */
.sura-name .btn:focus { box-shadow: 0 0 0 3px rgba(255,255,255,0.03); }

/* اگر خواستی می‌تونی مقدار top-offset را به body یا root بدهی:
   :root { --info-bar-top-offset: 56px; } و سپس .info-bar { --top-offset: var(--info-bar-top-offset); } */
</style>
