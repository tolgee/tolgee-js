<template>
  <select
    :value="$i18next.language"
    v-on:change="changeLanguage"
    class="lang-selector"
  >
    <option value="en">🇬🇧 English</option>
    <option value="cs">🇨🇿 Česky</option>
    <option value="fr">🇫🇷 Français</option>
    <option value="de">🇩🇪 Deutsch</option>
  </select>
</template>

<script>
export default {
  name: 'LanguageSelect',
  methods: {
    changeLanguage(e) {
      this.$i18next.changeLanguage(e.target.value);
    },
  },
};
</script>
