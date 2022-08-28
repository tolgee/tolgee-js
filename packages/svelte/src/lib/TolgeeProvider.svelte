<script lang="ts">
  import { onDestroy, onMount, setContext } from 'svelte';
  import { IcuFormatter, Tolgee, TolgeeConfig } from '@tolgee/core';
  import type { TolgeeContext } from './getTolgeeContext';

  export let config: TolgeeConfig;

  const tolgee = Tolgee.use(IcuFormatter).init({
    wrapperMode: 'invisible',
    ui:
      process.env.NODE_ENV !== 'development'
        ? undefined
        : typeof require !== 'undefined'
        ? require('@tolgee/ui')
        : import('@tolgee/ui'),
    ...(config || new TolgeeConfig()),
  });

  let tolgeeRunPromise: Promise<void>;

  setContext('tolgeeContext', {
    tolgee,
  } as TolgeeContext);

  if (typeof window !== 'undefined') {
    onMount(() => (tolgeeRunPromise = tolgee.run()));
    onDestroy(tolgee.stop);
  }
</script>

{#if !tolgee.initialLoading}
  <slot />
{:else if !tolgeeRunPromise}
  <slot name="loading-fallback" />
{:else}
  {#await tolgeeRunPromise}
    <slot name="loading-fallback" />
  {:then _}
    <slot />
  {/await}
{/if}
