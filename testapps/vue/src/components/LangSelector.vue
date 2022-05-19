<template>
  <select v-model="language" class="lang-selector">
    <option value="en">🇬🇧 English</option>
    <option value="cs">🇨🇿 Česky</option>
    <option value="fr">🇫🇷 Français</option>
    <option value="de">🇩🇪 Deutsch</option>
  </select>
</template>

<script lang="ts" setup>
import { useLanguage } from '@tolgee/vue';

const language = useLanguage();
</script>
