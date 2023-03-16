import { createApp } from 'vue';
import i18nextVue from 'i18next-vue';

import { i18next } from './i18n';
import App from './App.vue';

createApp(App).use(i18nextVue, { i18next }).mount('#app');
