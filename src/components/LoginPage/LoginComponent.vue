<template>
  <div class="max-w-lg mx-auto mt-40 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    
    <a href="#">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        دریافت کد تایید
      </h5>
    </a>

    <p class="mb-3 text-gray-700 dark:text-gray-400">
      لطفاً کد ۶ رقمی ارسال شده به ایمیل خود را وارد کنید.
    </p>

    <form class="w-full mx-auto" dir="ltr">
      <div class="flex mb-2 space-x-2 rtl:space-x-reverse items-center justify-center">
        <div>
          <label for="code-1" class="sr-only">رقم اول</label>
          <input type="text" maxlength="1" data-focus-input-init data-focus-input-next="code-2" id="code-1"
                 class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div>
          <label for="code-2" class="sr-only">رقم دوم</label>
          <input type="text" maxlength="1" data-focus-input-init data-focus-input-prev="code-1" data-focus-input-next="code-3" id="code-2"
                 class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div>
          <label for="code-3" class="sr-only">رقم سوم</label>
          <input type="text" maxlength="1" data-focus-input-init data-focus-input-prev="code-2" data-focus-input-next="code-4" id="code-3"
                 class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div>
          <label for="code-4" class="sr-only">رقم چهارم</label>
          <input type="text" maxlength="1" data-focus-input-init data-focus-input-prev="code-3" data-focus-input-next="code-5" id="code-4"
                 class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div>
          <label for="code-5" class="sr-only">رقم پنجم</label>
          <input type="text" maxlength="1" data-focus-input-init data-focus-input-prev="code-4" data-focus-input-next="code-6" id="code-5"
                 class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div>
          <label for="code-6" class="sr-only">رقم ششم</label>
          <input type="text" maxlength="1" data-focus-input-init data-focus-input-prev="code-5" id="code-6"
                 class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
      </div>

    </form>

    <a href="#"
       class="inline-flex items-center px-3 py-2 mt-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      تایید
      <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </a>

  </div>






<div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
  <form class="space-y-6" action="#">
    <h5 class="text-2xl font-bold text-gray-900 dark:text-white">ورود به حساب کاربری</h5>

    <div>
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">شماره همراه</label>
      <input 
        type="email" 
        name="email" 
        id="email" 
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
        placeholder="+98 9024815665" 
        required 
      />
    </div>

    <div>
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">رمز عبور</label>
      <input 
        type="password" 
        name="password" 
        id="password" 
        placeholder="••••••••" 
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
        required 
      />
    </div>

    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input 
          id="remember" 
          type="checkbox" 
          value="" 
          class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" 
        />
      </div>
      <label for="remember" class="me-2 text-sm font-medium text-gray-900 dark:text-gray-300">مرا به خاطر بسپار</label>
      <a href="#" class="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">رمز عبور را فراموش کرده‌اید؟</a>
    </div>

    <button 
      type="submit" 
      class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      ورود به حساب کاربری
    </button>

    <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
      ثبت‌نام نکرده‌اید؟ 
      <a href="#" class="text-blue-700 hover:underline dark:text-blue-500">ایجاد حساب کاربری</a>
    </div>
  </form>
</div>


</template>

<script setup>
</script>
