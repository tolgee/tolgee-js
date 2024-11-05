<script lang="ts">
  import type { Snippet } from 'svelte';
  import LangSelector from './LangSelector.svelte';

  type Props = {
    menuItems: Snippet;
  };

  const { menuItems }: Props = $props();
</script>

<div class="navbar">
  {@render menuItems?.()}
  <LangSelector />
</div>
