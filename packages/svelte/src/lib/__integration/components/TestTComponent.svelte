<script lang="ts">
  import { T, TolgeeProvider } from '$lib';
  import type { TolgeeInstance } from '@tolgee/web';

  export let tolgee: TolgeeInstance;
</script>

<TolgeeProvider {tolgee}>
  <div>
    <div data-testid="peter_dogs">
      <T keyName="peter_dogs" params={{ dogsCount: 5 }} />
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
    <div data-testid="with_language_prop">
      <T keyName="hello_world" language="en" />
    </div>
  </div>
  <span slot="fallback">Loading...</span>
</TolgeeProvider>
