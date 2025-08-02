<template>
  <!-- کنترلر بالای کادر اصلی -->
  <div class="text-light p-3 rounded mt-4 d-flex flex-wrap gap-3 align-items-center justify-content-between" style="max-width: 310px;margin: 0 auto;background-color: var(--bg-dark);" dir="rtl">
    <div class="form-group mb-0 flex-fill">
      <label for="surahSelect" class="form-label">انتخاب سوره:</label>
      <select id="surahSelect" class="form-select  text-light border border-secondary" style="background-color: var(--bg-dark);">
        <option value="4">نساء (۴)</option>
        <option value="5">مائده (۵)</option>
        <option value="6">انعام (۶)</option>
        <!-- بقیه سوره‌ها -->
      </select>
    </div>
    <div class="form-group mb-0 flex-fill">
      <label for="ayahSelect" class="form-label">انتخاب آیه:</label>
      <select id="ayahSelect" class="form-select  text-light border border-secondary" style="background-color: var(--bg-dark);">
        <option value="1">آیه ۱</option>
        <option value="2">آیه ۲</option>
        <option value="3">آیه ۳</option>
        <!-- ادامه آیه‌ها بر اساس سوره انتخابی -->
      </select>
    </div>
  </div>

  <div class="page-content container-fluid mt-4  p-4 rounded" style="margin-bottom: 100px;">
    <div class="d-flex h-100">
      <!-- ستون کناری -->
      <div class="d-flex flex-column me-3" style="width: 25%;">
        <!-- کادر پایین (نمایش آیه و اطلاعات) -->
        <div class="section-box flex-fill p-3" style="direction: rtl;">
          <div class="mb-3 border rounded p-3 shadow-sm verse-box">
            <h5 class="mb-2 text-green fw-bold">۱. آیه 1 سوره نساء</h5>

            <div class="row">
              <div class="col-md-6 mb-2"><strong>سوره:</strong> سوره نساء (۴)</div>
              <div class="col-md-6 mb-2"><strong>جزء:</strong> ۴</div>
              <div class="col-md-6 mb-2"><strong>محل نزول:</strong> مدینه</div>
              <div class="col-md-6 mb-2"><strong>نوع قرائت:</strong> ترتیل</div>
            </div>

            <div class="mt-3">
              <h6 class="text-accent">متن ترتیل</h6>
              <p class="fs-5" style="line-height: 2;">
                يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ مِّن نَّفْسٍ وَاحِدَةٍ ...
              </p>
            </div>

            <div class="mt-3">
              <h6 style="color: var(--text-accent);">ترجمه (مکارم شیرازی)</h6>
              <p>
                ای مردم! از (مخالفت) پروردگارتان بپرهیزید؛ همان کسی که همه شما را از یک انسان آفرید...
              </p>
            </div>

            <div class="mt-3">
              <h6 class="text-accent">فایل‌های صوتی</h6>
              <audio controls class="w-100 mb-2">
                <source src="https://example.com/audio1.mp3" type="audio/mp3">
              </audio>
              <audio controls class="w-100">
                <source src="https://example.com/audio2.mp3" type="audio/mp3">
              </audio>
            </div>
          </div>
        </div>


        <div class="section-box mt-3 flex-fill">
          <div class="mb-3 border rounded p-3 shadow-sm verse-box">

          <h6 class="section-title">کادر بالا</h6>
          <p v-for="i in 10" :key="i">محتوای زیاد شماره {{ i }}</p>
          </div>
        </div>
      </div>

      <!-- محتوای اصلی -->
      <div class="flex-grow-1 d-flex flex-column section-box content-box">
        <div class="mb-3 border rounded p-3 shadow-sm verse-box">


        <!-- آیه -->
        <div class="text-center verse-text mb-3">
          ﴿وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ﴾
        </div>

        <!-- معنی -->
        <div class="text-center verse-meaning mb-4">
          و تو قطعاً در اخلاق بزرگ هستی.
        </div>

        <!-- ترجمه فارسی -->
        <div class="translation-box border-green">
          <h5 class="section-title text-green">ترجمه‌های فارسی</h5>
          <ul class="list-unstyled">
            <li>ترجمه اول: و تو واقعاً دارای اخلاقی بزرگ هستی.</li>
            <li>ترجمه دوم: تو بر خُلقی عظیم هستی.</li>
          </ul>
        </div>

        <!-- ترجمه انگلیسی -->
        <div class="translation-box border-green" dir="ltr">
          <h5 class="section-title text-green">English Translations</h5>
          <ul class="list-unstyled">
            <li>Translation 1: And indeed, you are of a great moral character.</li>
            <li>Translation 2: Indeed, you possess an excellent character.</li>
          </ul>
        </div>

        <div class="translation-box border-red" dir="rtl">
          <h5 class="section-title text-red">معانی کلمات آیه</h5>
          <table class="table table-sm table-bordered text-light rounded overflow-hidden custom-dark-table">
            <thead class="text-center">
              <tr>
                <th style="background-color: var(--bg-dark);" class="text-light">کلمه</th>
                <th style="background-color: var(--bg-dark);" class="text-light">معنی</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>وَإِنَّكَ</td><td>و تو قطعاً</td></tr>
              <tr><td>لَعَلَىٰ</td><td>بر روی</td></tr>
              <tr><td>خُلُقٍ</td><td>اخلاق</td></tr>
              <tr><td>عَظِيمٍ</td><td>بزرگ</td></tr>
            </tbody>
          </table>
        </div>



        <!-- تفسیر -->
        <div class="translation-box border-purple">
          <h5 class="section-title text-purple">تفسیر آیه</h5>
          <p dir="rtl">این آیه به اخلاق و شخصیت والای پیامبر اکرم (ص) اشاره دارد و نشان‌دهنده اهمیت اخلاق در اسلام است...</p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
:root {
  --bg-dark: #1a1a1a;
  --bg-dark-light: #242424;
  --text-light: #f0f0f0;
  --text-muted: #bbbbbb;
  --text-accent: #00bcd4;
  --border-color: #333333;
  --green: #4caf50;
  --red: #f44336;
  --purple: #b48bf2;
}

/* body {
  background-color: #000;
  color: var(--text-light);
} */

.page-content {
  background-color: var(--bg-dark);
  color: var(--text-light);
  min-height: 100vh;
  overflow-y: auto;
  width: 90%;
  border-radius: 1rem;
  /* margin-bottom: 8rem; */
}

/* اسکرول فقط برای کل صفحه */
body, html {
  overflow-y: auto;
  height: 100%;
  margin: 0;
}

/* باکس‌ها */
.section-box {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1rem;
  color: var(--text-light);
}

.verse-box {
  /* background-color: var(--bg-dark-light);
   */
  background-color: var(--bg-dark);
  border: 1px solid var(--border-color);
  color: var(--text-light);
}

/* آیه */
.verse-text {
  font-size: 2.3rem;
  font-weight: bold;
  font-family: 'Amiri', 'Scheherazade New', serif;
  direction: rtl;
  line-height: 2;
}

/* معنی */
.verse-meaning {
  font-size: 1.2rem;
  color: var(--text-accent);
  direction: rtl;
}

/* ترجمه‌ها */
.translation-box {
  background-color: rgba(255, 255, 255, 0.025);
  border: 1px solid;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

/* عنوان‌ها */
.section-title {
  font-size: 1.05rem;
  font-weight: bold;
  padding-bottom: 0.4rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid currentColor;
}

/* رنگ‌ها */
.text-accent {
  color: var(--text-accent);
}
.border-accent {
  border-color: var(--text-accent);
}

.text-green {
  color: var(--green);
}
.border-green {
  border-color: var(--green);
}

.text-red {
  color: var(--red);
}
.border-red {
  border-color: var(--red);
}

.text-purple {
  color: var(--purple);
}
.border-purple {
  border-color: var(--purple);
}


.custom-dark-table {
  background-color: var(--bg-dark);
  border-color: var(--border-color);
  color: var(--text-light);
}

.custom-dark-table thead {
  background-color: #222; /* رنگ کمی تیره‌تر برای هدر */
  color: var(--text-light);
}

.custom-dark-table thead th {
  border-color: var(--border-color);
  font-weight: 600;
  text-align: center;
}

.custom-dark-table tbody tr {
  border-color: var(--border-color);
  transition: background-color 0.3s ease;
}

.custom-dark-table tbody tr:hover {
  background-color: rgba(255 255 255 / 0.1); /* افکت هاور ملایم */
}

.custom-dark-table tbody td {
  background-color: var(--bg-dark);
  border-color: var(--border-color);
  color: var(--text-light);
  padding: 0.5rem 1rem;
  vertical-align: middle;
}


</style>
