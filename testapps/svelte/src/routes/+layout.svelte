<script lang="ts">
  import { TolgeeProvider, Tolgee, DevTools, BackendFetch } from '@tolgee/svelte';
  import { FormatIcu } from '@tolgee/format-icu';
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();

  const tolgee = Tolgee()
    .use(DevTools())
    .use(FormatIcu())
    .use(BackendFetch())
    .init({
      apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
      apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
      language: 'en',
      availableLanguages: ['en', 'de', 'cs', 'fr']
    });
</script>

<TolgeeProvider {tolgee}>
  <div slot="fallback">Loading...</div>
  {@render children?.()}
</TolgeeProvider>
