import Vue from 'vue';
import { withTolgee } from '@tolgee/i18next';
import i18next from 'i18next';
import ICU from 'i18next-icu';
import VueI18Next from '@panter/vue-i18next';

import App from './App.vue';

Vue.use(VueI18Next);
Vue.config.productionTip = false;

withTolgee(i18next, {
  apiUrl: process.env.VUE_APP_TOLGEE_API_URL,
  apiKey: process.env.VUE_APP_TOLGEE_API_KEY,
  ui: process.env.VUE_APP_TOLGEE_API_KEY ? require('@tolgee/ui').UI : undefined,
  staticData: {
    en: () => import('../i18n/en.json'),
    de: () => import('../i18n/de.json'),
    fr: () => import('../i18n/fr.json'),
    cs: () => import('../i18n/cs.json'),
  },
})
  .use(ICU)
  .init({
    lng: 'en', // or use i18next language detector
    supportedLngs: ['cs', 'en', 'fr', 'de'],
  });

const i18n = new VueI18Next(i18next);

new Vue({
  render: (h) => h(App),
  i18n,
}).$mount('#app');
