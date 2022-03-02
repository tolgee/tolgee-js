<script>
  import { T, TolgeeProvider } from '$lib';
  import InstanceGrabber from './InstanceGrabber.svelte';
  export let config;
  export let instanceRef;
</script>

<TolgeeProvider {config}>
  <div>
    <div data-testid="peter_dogs">
      <T keyName="peter_dogs" parameters={{ dogsCount: 5 }} />
    </div>
    <div data-testid="hello_world">
      <T keyName="hello_world" />
    </div>
    <div data-testid="hello_world_no_wrap">
      <T keyName="hello_world" noWrap />
    </div>
    <div data-testid="non_existant">
      <T keyName="non_existant" defaultValue="Non existant" />
    </div>
  </div>
  <InstanceGrabber {instanceRef} />
  <span slot="loading-fallback">Loading...</span>
</TolgeeProvider>
