<template>
  <TolgeeProvider :tolgee="tolgee" :fallback="fallback">
    <div>It's rendered!</div>
    <ComponentUsingProvider />
  </TolgeeProvider>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import ComponentUsingProvider from './ComponentUsingProvider.vue';
import { TolgeeProvider } from '../TolgeeProvider';
import { TolgeeInstance } from '@/../core/lib';
import { PropType } from 'vue';

export default defineComponent({
  components: { ComponentUsingProvider, TolgeeProvider },
  props: {
    tolgee: { type: Object as PropType<TolgeeInstance> },
    fallback: {
      type: [Object, String] as PropType<JSX.Element | string>,
    },
  },
});
</script>
