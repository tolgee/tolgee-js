<script lang="ts">
  import { TolgeeProvider } from '$lib';
  import type {TolgeeInstance} from '@tolgee/core';

  import TestTranslateComponentInside from './TestTranslateComponentInside.svelte';
  export let tolgee: TolgeeInstance;
</script>

<TolgeeProvider tolgee={tolgee}>
  <TestTranslateComponentInside />
  <span slot="loading-fallback">Loading...</span>
</TolgeeProvider>
