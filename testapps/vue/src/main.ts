import { createApp } from 'vue';
import App from './App.vue';
import { Tolgee, VuePlugin, TolgeeVue } from '@tolgee/vue';
import { IcuPlugin } from '@tolgee/icu-formatter';

const tolgee = Tolgee()
  .use(VuePlugin())
  .use(IcuPlugin())
  .init({
    language: 'en',
    staticData: {
      en: () => import('../i18n/en.json'),
      de: () => import('../i18n/de.json'),
      cs: () => import('../i18n/cs.json'),
      fr: () => import('../i18n/fr.json'),
      'en:base': () => import('../i18n/en/base.json'),
      'en:test1': () => import('../i18n/en/test1.json'),
      'en:test2': () => import('../i18n/en/test2.json'),
      'en:test3': () => import('../i18n/en/test3.json'),
      'cs:base': () => import('../i18n/cs/base.json'),
      'cs:test1': () => import('../i18n/cs/test1.json'),
      'cs:test2': () => import('../i18n/cs/test2.json'),
      'cs:test3': () => import('../i18n/cs/test3.json'),
    },
    // @ts-ignore
    apiUrl: process.env.VUE_APP_TOLGEE_API_URL,
    // @ts-ignore
    apiKey: process.env.VUE_APP_TOLGEE_API_KEY,
  });

const app = createApp(App);

app.use(TolgeeVue, { tolgee });
app.mount('#app');
