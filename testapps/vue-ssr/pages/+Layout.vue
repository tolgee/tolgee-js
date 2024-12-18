<template>
  <TolgeeProvider :ssr="{ staticData, language: 'en' }">
    <slot></slot>
  </TolgeeProvider>
</template>

<script setup>
import '../assets/style.css';
import { useData } from 'vike-vue/useData';
import { TolgeeProvider } from '@tolgee/vue';

const staticData = useData();
</script>
