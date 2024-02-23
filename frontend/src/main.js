import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import api from '@/plugins/axios';
import addInterceptors from '@/plugins/interceptors';

const app = createApp(App);

app.use(createPinia());
app.use(router);
addInterceptors(api, router);

useAuthStore().init();

app.mount('#app');
