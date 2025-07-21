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

<script>
export default {
  emits: ['toggle-menu'],
  data() {
    return {
      isFixed: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    toggleMenu() {
      this.$emit('toggle-menu')
    },
    handleScroll() {
      const offsetTop = this.$refs.infoBarRef ? this.$refs.infoBarRef.offsetTop : 0
      this.isFixed = window.scrollY > offsetTop
    }
  }
}
</script>

<style scoped>
.info-bar {
  background-color: var(--bg-dark);
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 998;
  transition: all 0.3s ease;
}

.fixed-info-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.sura-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-light);
}

.details {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
