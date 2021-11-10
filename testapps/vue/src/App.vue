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
import { TolgeeConfig } from '../../../packages/vue/node_modules/@tolgee/core/lib';
import en from '../i18n/en.json';
import de from '../i18n/de.json';
import cs from '../i18n/cs.json';
import fr from '../i18n/fr.json';

export default defineComponent({
  name: 'App',
  components: { TolgeeProvider, Todos, TranslationMethods },
  data() {
    return {
      config: {
        staticData: { en, de, cs, fr },
        apiUrl: process.env.VUE_APP_TOLGEE_API_URL,
        apiKey: process.env.VUE_APP_TOLGEE_API_KEY,
        ui: process.env.VUE_APP_TOLGEE_API_KEY
          ? require('@tolgee/ui').UI
          : undefined,
      } as TolgeeConfig,
      currentRoute: window.location.pathname,
    };
  },
});
</script>
