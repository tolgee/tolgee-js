<script lang="ts">
  import { setContext, SvelteComponent } from 'svelte';

  export let Component: SvelteComponent;
  export let contexts: Record<string, unknown> = {};
  export let componentProps: Record<string, unknown>;

  Object.entries(contexts).forEach(([key, value]) => {
    setContext(key, value);
  });
</script>

<svelte:component this={Component} {...componentProps} />
