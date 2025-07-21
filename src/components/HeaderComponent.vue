<template>
  <header class="header">
    <a href="#" class="logo">
      <i class="fas fa-quran"></i> Quran
    </a>

    <nav>
      <a href="#"><i class="fas fa-fire"></i> ترند</a>
      <a href="#"><i class="fas fa-headphones"></i> قرائت</a>
      <a href="#"><i class="fas fa-bookmark"></i> نشانه‌ها</a>
    </nav>

    <div class="actions">
      <button class="icon-button" title="جستجو"><i class="fas fa-search"></i></button>
      <select class="lang-select" v-model="language">
        <option value="fa">فا</option>
        <option value="en">EN</option>
        <option value="ar">AR</option>
      </select>
      <button class="icon-button"><i class="fas fa-user-circle"></i></button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      language: 'fa'
    }
  }
}
</script>

<style scoped>
.header {
  background-color: var(--bg-dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-accent);
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.logo i {
  font-size: 1.7rem;
}

nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

nav a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.3s;
}

nav a:hover {
  color: var(--text-light);
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-button {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s;
}

.icon-button:hover {
  color: var(--icon-hover);
}

.lang-select {
  background-color: var(--bg-dark);
  border: 1px solid var(--border-color);
  color: var(--text-light);
  border-radius: 5px;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
}
</style>
