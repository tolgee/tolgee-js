<template>
  <TolgeeProvider :config="config">
    <template v-if="currentRoute === '/'">
      <Todos />
    </template>
    <template v-else>
      <TranslationMethods />
    </template>
    <template v-slot:fallback>
      <div>Loading...</div>
    </template>
  </TolgeeProvider>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
import { defineComponent } from 'vue';
import { TolgeeProvider } from '@tolgee/vue';

import Todos from './Todos.vue';
import TranslationMethods from './TranslationMethods.vue';

export default defineComponent({
  name: 'App',
  components: { TolgeeProvider, Todos, TranslationMethods },
  data() {
    return {
      config: {
        defaultLanguage: 'en',
        staticData: {
          en: () => import('../i18n/en.json'),
          de: () => import('../i18n/de.json'),
          fr: () => import('../i18n/fr.json'),
          cs: () => import('../i18n/cs.json'),
        },
        // remove this to enable language auto detection
        enableLanguageDetection: false,
        apiUrl: process.env.VUE_APP_TOLGEE_API_URL,
        apiKey: process.env.VUE_APP_TOLGEE_API_KEY,
      },
      currentRoute: window.location.pathname,
    };
  },
});
</script>
