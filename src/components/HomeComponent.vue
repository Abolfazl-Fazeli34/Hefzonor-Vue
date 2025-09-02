<template>
  <div class="home-page container mt-4 mb-4" dir="rtl">
    <!-- هدر -->
    <header class="main-header py-4 text-center">
      <h1 class="logo">حفظ النور</h1>
      <div class="search-bar container">
        <input type="text" class="form-control" placeholder="جستجو در قرآن...">
      </div>
    </header>

    <main class="container mt-5">
      <!-- Start Reading -->
      <section class="mb-5">
        <div class="card p-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div>
            <h2 class="fs-4 fw-bold">شروع تلاوت</h2>
            <p class="mb-0">سوره فاتحه (الحمد)</p>
          </div>
          <button class="btn btn-accent mt-3 mt-md-0">شروع</button>
        </div>
      </section>

      <!-- Explore Topics -->
      <section class="mb-5">
        <h3 class="section-heading">کاوش موضوعات</h3>
        <div class="d-flex gap-3 flex-wrap">
          <button class="btn btn-outline-light">آیات درباره ایمان</button>
          <button class="btn btn-outline-light">آیات درباره نماز</button>
          <button class="btn btn-outline-light">آیات درباره رمضان</button>
        </div>
      </section>

      <!-- Quran in a Year -->
      <section class="mb-5 text-center">
        <h3 class="section-heading">قرآن در یک سال</h3>
        <blockquote class="fs-4">وَإِذَا ذُكِّرُوا لَا يَخِرُّونَ عَلَيْهَا صُمًّا وَعُمْيَانًا</blockquote>
        <p class="text-muted">یک برنامه برای ختم قرآن در یک سال...</p>
        <button class="btn btn-accent">شروع مطالعه</button>
      </section>

      <!-- Learning Plans -->
      <section class="mb-5">
        <h3 class="section-heading">برنامه‌های یادگیری</h3>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card p-3">از تاریکی به نور - سفر رحمت</div>
          </div>
          <div class="col-md-4">
            <div class="card p-3">اعتیاد دیجیتال - درمان قلب</div>
          </div>
          <div class="col-md-4">
            <div class="card p-3">تدبر در سوره یس</div>
          </div>
        </div>
      </section>

      <!-- Community -->
      <section class="mb-5">
        <h3 class="section-heading">انجمن</h3>
        <div class="card p-3">
          <p class="mb-0">@QuranReflect - یادداشت‌های کاربران</p>
        </div>
      </section>

      <!-- Surah List -->
      <section class="mb-5">
        <h3 class="section-heading">فهرست سوره‌ها</h3>
        <div class="row g-3">
          <div v-for="n in 20" :key="n" class="col-md-3 col-sm-6">
            <div class="card p-3 d-flex justify-content-between">
              <span>سوره {{ n }}</span>
              <small class="text-muted">آیات: {{ 3 + n }}</small>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer text-center py-4 mt-5">
      <p class="mb-1">© 2025 حفظ النور</p>
      <small class="text-muted">توسعه داده شده برای تمرین</small>
    </footer>
  </div>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
/* رنگ‌بندی */
:root {
  --bg-dark: #121212;
  --card-dark: #1f1f1f;
  --text-light: #f5f5f5;
  --text-accent: #00bcd4;
  --border-color: #333;
}

.home-page {
  background-color: var(--bg-dark);
  color: var(--text-light);
  min-height: 100vh;
}

/* هدر */
.main-header {
  background-color: var(--card-dark);
  border-bottom: 1px solid var(--border-color);
}
.logo {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-accent);
}
.search-bar input {
  max-width: 500px;
  margin: 0 auto;
}

/* کارت‌ها */
.card {
  background-color: var(--card-dark);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  color: var(--text-light);
}
.card:hover {
  border-color: var(--text-accent);
}

/* دکمه‌ها */
.btn-accent {
  background-color: var(--text-accent);
  color: var(--bg-dark);
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
}
.btn-outline-light {
  border: 1px solid var(--text-light);
  color: var(--text-light);
  border-radius: 0.5rem;
}
.btn-outline-light:hover {
  background-color: var(--text-light);
  color: var(--bg-dark);
}

/* بخش‌ها */
.section-heading {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--text-accent);
}

/* فوتر */
.footer {
  background-color: var(--card-dark);
  border-top: 1px solid var(--border-color);
}
</style>
