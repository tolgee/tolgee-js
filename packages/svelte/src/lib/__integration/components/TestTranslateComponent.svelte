<script lang="ts">
  import { TolgeeProvider } from '$lib';
  import type {TolgeeInstance} from '@tolgee/web';

  import TestTranslateComponentInside from './TestTranslateComponentInside.svelte';
  export let tolgee: TolgeeInstance;
</script>

<TolgeeProvider tolgee={tolgee}>
  <TestTranslateComponentInside />
  <span slot="fallback">Loading...</span>
</TolgeeProvider>
