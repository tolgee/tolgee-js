<template>
  <TolgeeProvider>
    <template v-slot:fallback>
      <div>Loading...</div>
    </template>
    <template v-if="currentRoute === '/'">
      <Todos />
    </template>
    <template v-else>
      <TranslationMethods />
    </template>
  </TolgeeProvider>
</template>

<script lang="ts" setup>
import Todos from './Todos.vue';
import TranslationMethods from './TranslationMethods.vue';

import { TolgeeProvider } from '@tolgee/vue';

const currentRoute = window.location.pathname;
</script>
