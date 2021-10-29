<script lang="ts">
  import { getLanguageStore } from "@tolgee/svelte";

  const languageStore = getLanguageStore();
</script>

<select bind:value={$languageStore} class="lang-selector">
  <option value="en">🇬🇧 English</option>
  <option value="cs">🇨🇿 česky</option>
  <option value="fr">🇫🇷 français</option>
  <option value="de">🇩🇪 Deutsch</option>
</select>
