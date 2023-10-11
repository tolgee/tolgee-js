<template>
  <select
    :value="tolgee.getLanguage()"
    v-on:change="changeLanguage"
    class="lang-selector"
  >
    <option value="en">English</option>
    <option value="cs">Česky</option>
    <option value="fr">Français</option>
    <option value="de">Deutsch</option>
  </select>
</template>

<script setup>
import { useTolgee } from '@tolgee/vue';

const tolgee = useTolgee(['language', 'pendingLanguage']);

const changeLanguage = (e) => {
  tolgee.value.changeLanguage(e.target.value);
};
</script>
