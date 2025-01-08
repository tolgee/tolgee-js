<script lang="ts">
  import { TolgeeProvider, T } from '$lib';
  import type { TolgeeInstance } from '@tolgee/web';
  export let tolgee: TolgeeInstance;
</script>

<TolgeeProvider {tolgee}>
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
  <span slot="fallback">Loading...</span>
</TolgeeProvider>
