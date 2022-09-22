<script lang="ts">
  import { onDestroy, onMount, setContext } from 'svelte';
  import type { TolgeeInstance } from '@tolgee/core';
  import type { TolgeeSvelteContext } from './types';

  export let tolgee: TolgeeInstance;

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
  <slot name="loading-fallback" />
{/if}
