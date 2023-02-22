import { createApp } from 'vue';
import App from './App.vue';
import { Tolgee, DevTools, VueTolgee, BackendFetch } from '@tolgee/vue';
import { FormatIcu } from '@tolgee/format-icu';

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatIcu())
  .use(BackendFetch())
  .init({
    language: 'en',
    apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
    apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
  });

const app = createApp(App);

app.use(VueTolgee, { tolgee });
app.mount('#app');
