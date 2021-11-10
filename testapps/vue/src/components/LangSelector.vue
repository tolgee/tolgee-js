<template>
  <select v-model="tolgeeLanguage" class="lang-selector">
    <option value="en">🇬🇧 English</option>
    <option value="cs">🇨🇿 Česky</option>
    <option value="fr">🇫🇷 Français</option>
    <option value="de">🇩🇪 Deutsch</option>
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
