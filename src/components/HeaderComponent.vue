<template>
  <div class="px-8">
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen flex flex-wrap items-center justify-between mx-auto py-4">
        <a href="#" class="flex items-center space-x-2 md:space-x-3 rtl:space-x-reverse">
          <img src="../../public/logo.png" class="rounded-full h-6 md:h-8 w-6 md:w-8" alt="Flowbite Logo" />
          <span class="text-lg md:text-2xl font-semibold whitespace-nowrap dark:text-white">حفظ النور</span>
        </a>

        <div class="flex items-center md:order-2 gap-2 md:gap-3 text-gray-600 dark:text-gray-300">
            <button v-if="!isDark" @click="setDark" class="p-1 md:p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 md:w-6 md:h-6">
                <use href="#moon"></use>
              </svg>
            </button>

            <button v-if="isDark" @click="setLight" class="p-1 md:p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 md:w-6 md:h-6">
                <use href="#sun"></use>
              </svg>
            </button>


          <button type="button" class="flex rounded-ful p-1 md:p-2" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
            <span class="sr-only">Open user menu</span>
            <img class="w-6 h-6 md:w-8 md:h-8 rounded-full"  id="avatarButton" type="button" data-dropdown-toggle="userDropdown" data-dropdown-placement="bottom-start" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="user photo">
          </button>
          <!-- Dropdown menu -->
          <div id="userDropdown" class="z-30 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600">
              <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div>کاربر الکی</div>
                <div class="font-medium truncate">+989024815665</div>
              </div>
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">صفحه اصلی</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">تنظمات</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">اطلاعات کاربری</a>
                </li>
              </ul>
              <div class="py-1">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">خروج</a>
              </div>
          </div>

          <button data-collapse-toggle="navbar-user" type="button" class="inline-flex items-center p-2 w-8 h-8 md:w-10 md:h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg class="w-4 h-4 md:w-5 md:h-5">
              <use href="#queue-list"></use>
            </svg>
          </button>
        </div>

        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul class="flex flex-col md:flex-row font-medium p-2 md:p-0 mt-2 md:mt-0 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li><a href="#" class="block py-1 md:py-2 px-2 md:px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:dark:text-blue-500" aria-current="page">صفحه اصلی</a></li>
            <li><a href="#" class="block py-1 md:py-2 px-2 md:px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700">درباره ما</a></li>
            <li><a href="#" class="block py-1 md:py-2 px-2 md:px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700">راهنما</a></li>
            <!-- <li><a href="#" class="block py-1 md:py-2 px-2 md:px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700">اشتراک حمایتی</a></li> -->
            <!-- <li><a href="#" class="block py-1 md:py-2 px-2 md:px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700">Contact</a></li> -->
          </ul>
        </div>
      </div>
    </nav>

    <nav class="bg-white border-gray-400 dark:bg-gray-900 pb-3 border-b dark:border-gray-500">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen ">   
        <button @click.prevent="toggleSurahOpen" type="button" class="flex items-center gap-2 rtl:gap-2 justify-center">
          <span class="self-center text-base sm:text-lg md:text-xl font-semibold whitespace-nowrap dark:text-white">سوره فاتحه</span>
          <svg
            class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-300"
            :class="{'rotate-180': isOpen, 'rotate-90': !isOpen}"
          >
            <use href="#arrow"></use>
          </svg>
        </button>

        <div class="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse text-xs sm:text-sm">
              
              <!-- خانه -->
              <li class="inline-flex items-center">
                <a href="#" class="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                  <svg class="w-3 h-3 me-1 sm:me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <use href="#home"></use>
                  </svg>
                  خانه
                </a>
              </li>

              <!-- قران -->
              <li>
                <div class="flex items-center">
                  <svg class="w-3 h-3  text-gray-400 mx-1 rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <use href="#arrow"></use>
                  </svg>
                  <a href="#" class="ms-1 text-xs sm:text-sm md:text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">قران</a>
                </div>
              </li>

              <!-- سوره فاتحه -->
              <li aria-current="page">
                <div class="flex items-center">
                  <svg class="w-3 h-3  text-gray-400 mx-1 rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <use href="#arrow"></use>
                  </svg>
                  <span class="ms-1 text-xs sm:text-sm md:text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">سوره فاتحه</span>
                </div>
              </li>

            </ol>
          </nav>
        </div>

      </div>
    </nav>
  </div>
</template>


<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const isOpen = computed(() => store.state.isOpen)

const toggleSurahOpen = () => {
  store.commit('toggleIsOpen')
}


const html = document.documentElement
const store = useStore()

const isDark = computed(() => store.getters.getTheme === 'dark')

const setDark = () => {
  store.dispatch('updateTheme', 'dark')
  html.classList.add('dark')
}

const setLight = () => {
  store.dispatch('updateTheme', 'light')
  html.classList.remove('dark')
}

onMounted(() => {
  if (store.getters.getTheme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
})
</script>
