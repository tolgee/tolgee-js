<template>
  <TolgeeProvider :config="config">
    <div>It's rendered!</div>
    <ComponentUsingProvider />
  </TolgeeProvider>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import ComponentUsingProvider from './ComponentUsingProvider.vue';
import { TolgeeProvider } from '../TolgeeProvider';

export default defineComponent({
  components: { ComponentUsingProvider, TolgeeProvider },
  props: {
    config: Object,
  },
});
</script>
