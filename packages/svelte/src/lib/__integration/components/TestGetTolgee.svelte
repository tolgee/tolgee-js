<script lang="ts">
  import { getTolgee } from "$lib/getTolgee";


  const tolgeeReactive = getTolgee(['language'])
  const tolgee = getTolgee()
</script>

<div data-testid="language-reactive">{$tolgeeReactive.getLanguage()}</div>
<div data-testid="language-non-reactive">{$tolgee.getLanguage()}</div>

