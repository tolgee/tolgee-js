<script>
  import { TolgeeProvider, T } from '$lib';
  export let config;
</script>

<TolgeeProvider {config}>
  <div>
    <div data-testid="hello_world">
      <T keyName="hello_world" />
    </div>
    <div data-testid="english_fallback">
      <T keyName="english_fallback" />
    </div>
    <div data-testid="non_existant">
      <T keyName="non_existant" defaultValue="Default value" />
    </div>
  </div>
  <span slot="loading-fallback">Loading...</span>
</TolgeeProvider>
