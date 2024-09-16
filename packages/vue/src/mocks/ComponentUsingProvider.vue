<template>
  <div v-if="tolgeeContext">
    {{ tolgeeContext.tolgee.getLanguage() }}
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { TolgeeVueContext } from '@tolgee/vue';

const tolgeeContext = inject<TolgeeVueContext>('tolgeeContext');
</script>
