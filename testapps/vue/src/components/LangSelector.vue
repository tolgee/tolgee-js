<template>
  <select :value="language" v-on:change="changeLanguage" class="lang-selector">
    <option value="en">🇬🇧 English</option>
    <option value="cs">🇨🇿 Česky</option>
    <option value="fr">🇫🇷 Français</option>
    <option value="de">🇩🇪 Deutsch</option>
  </select>
</template>

<script lang="ts" setup>
import { useTolgee } from '@tolgee/vue';
import { computed } from 'vue';

const tolgee = useTolgee();

// @ts-ignore
const changeLanguage = (e) => {
  tolgee.value.changeLanguage(e.target.value);
};

const language = computed(() => tolgee.value.getLanguage());
</script>
