// /home/hamyar/Desktop/My_Folder/Frontend/src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '../public/styles/output.css';
import 'flowbite'; // مهم: JS کامپوننت‌ها را فعال می‌کند

createApp(App).use(router).use(store).mount('#app');
