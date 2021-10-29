<template>
  <span>{{ $t('hello') }}</span>
  <span>{{ $t('hello2', { name: 'test' }) }}</span>
  <span>{{ $t('hello3', undefined, true, 'Default') }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TolgeeMixin } from '../TolgeeMixin';

export default defineComponent({
  mixins: [TolgeeMixin],
  name: 'MixinComponent',
});
</script>
