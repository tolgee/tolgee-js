<script lang="ts">
  import { onDestroy, onMount, setContext } from 'svelte';
  import type { TolgeeInstance } from '@tolgee/web';
  import type { TolgeeSvelteContext } from './types';

  export let tolgee: TolgeeInstance;
  export let fallback = undefined;

  let isLoading: boolean = !tolgee.isLoaded();

  setContext('tolgeeContext', {
    tolgee,
  } as TolgeeSvelteContext);

  if (typeof window !== 'undefined') {
    onMount(() => {
      tolgee.run().then(() => {
        isLoading = false
      })
    });
    onDestroy(tolgee.stop);
  }
</script>

{#if !isLoading }
  <slot />
{:else }
  {#if fallback}
    {fallback}
  {:else}
    <slot name="loading-fallback" />
  {/if}
{/if}
