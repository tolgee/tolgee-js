<script>
  import { TolgeeProvider } from '$lib';
  import InstanceGrabber from './InstanceGrabber.svelte';
  import TestTranslateComponentInside from './TestTranslateComponentInside.svelte';
  export let config;
  export let instanceRef;
</script>

<TolgeeProvider {config}>
  <TestTranslateComponentInside />
  <InstanceGrabber {instanceRef} />
  <span slot="loading-fallback">Loading...</span>
</TolgeeProvider>
