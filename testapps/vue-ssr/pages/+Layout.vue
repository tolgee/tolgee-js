<template>
  <TolgeeProvider :tolgee="tolgee">
    <slot></slot>
  </TolgeeProvider>
</template>

<script setup>
import '../assets/style.css';
import { useData } from 'vike-vue/useData';
import { usePageContext } from 'vike-vue/usePageContext';
import { getCurrentInstance } from 'vue';
import { TolgeeProvider, useTolgeeSSR } from '@tolgee/vue';

const context = usePageContext();
const staticData = useData();

const tolgee = useTolgeeSSR(
  getCurrentInstance().proxy.$tolgee,
  context.lang,
  staticData
);
</script>
