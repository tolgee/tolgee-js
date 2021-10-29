<script lang="ts">
  import { onDestroy, onMount, setContext } from "svelte";
  import { Tolgee, TolgeeConfig } from "@tolgee/core";
  import type { TolgeeContext } from "./getTolgeeContext";

  export let config: TolgeeConfig;

  const tolgee = new Tolgee(config || new TolgeeConfig());

  let tolgeeRunPromise: Promise<void>;

  onMount(() => tolgeeRunPromise = tolgee.run());

  setContext("tolgeeContext", {
    tolgee
  } as TolgeeContext);

  if (typeof window !== "undefined") {
    onDestroy(tolgee.stop);
  }
</script>

{#if !tolgee.initialLoading}
  <slot />
{:else}
  {#if !tolgeeRunPromise}
    <slot name="loading-fallback" />
  {:else }

    {#await tolgeeRunPromise}
      <slot name="loading-fallback" />
    {:then _}
      <slot />
    {/await}
  {/if}
{/if}
