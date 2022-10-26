import { createApp } from 'vue';
import App from './App.vue';
import { Tolgee, VuePlugin, VueTolgee } from '@tolgee/vue';
import { FormatIcu } from '@tolgee/format-icu';
import { BackendFetch } from '@tolgee/web';

const tolgee = Tolgee()
  .use(VuePlugin())
  .use(FormatIcu())
  .use(BackendFetch())
  .init({
    language: 'en',
    apiUrl: process.env.VUE_APP_TOLGEE_API_URL,
    apiKey: process.env.VUE_APP_TOLGEE_API_KEY,
  });

const app = createApp(App);

app.use(VueTolgee, { tolgee });
app.mount('#app');
