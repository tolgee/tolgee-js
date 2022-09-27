<script lang="ts">
  import type { TolgeeInstance } from "@tolgee/core";
  import { TolgeeProvider } from "$lib";

  export let tolgee: TolgeeInstance
</script>

<TolgeeProvider tolgee={tolgee} fallback="loading">
  <div>
    It's rendered!
  </div>
</TolgeeProvider>
