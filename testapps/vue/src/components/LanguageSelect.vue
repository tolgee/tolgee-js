<template>
  <select v-model="tolgeeLanguage">
    <option value="en">en</option>
    <option value="de">de</option>
  </select>
</template>

<script lang="ts">
import { TolgeeMixin } from '@tolgee/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  mixins: [TolgeeMixin],
  name: 'LanguageSelect',
});
</script>
