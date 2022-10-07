<script lang="ts">
  import { getTolgee } from '@tolgee/svelte';

  const tolgee = getTolgee()

  function handleLanguageChange(e: any) {
    $tolgee.changeLanguage(e.currentTarget!.value)
  }
</script>

<select value={$tolgee.getPendingLanguage()} on:change={handleLanguageChange} class="lang-selector">
  <option value="en">🇬🇧 English</option>
  <option value="cs">🇨🇿 česky</option>
  <option value="fr">🇫🇷 français</option>
  <option value="de">🇩🇪 Deutsch</option>
</select>