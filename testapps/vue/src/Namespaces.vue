<template>
  <div class="background-wrapper">
    <div class="example">
      <Navbar>
        <div>
          <a href="/">The example app</a>
        </div>
      </Navbar>
      <template v-if="isLoading">Loading...</template>
      <template v-else>
        <div>{{ $t('test', { ns: 'base' }) }}</div>
        <div>{{ $t('test', { ns: 'test1' }) }}</div>
        <div>{{ $t('test', { ns: 'test2' }) }}</div>
        <div>{{ $t('test', { ns: 'test3' }) }}</div>
      </template>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { useTranslate } from '@tolgee/vue';
import Navbar from './components/Navbar.vue';

const { isLoading } = useTranslate(['base', 'test1', 'test2', 'test3']);
</script>
