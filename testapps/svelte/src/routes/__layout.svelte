<script lang="ts">
  import { TolgeeProvider } from "@tolgee/svelte";
  import UI from "@tolgee/ui";
  import type { TolgeeConfig } from "@tolgee/core";
  import enLang from "../i18n/en.json"
  import deLang from "../i18n/de.json"
  import csLang from "../i18n/cs.json"
  import frLang from "../i18n/fr.json"

  const tolgeeConfig = {
    preloadFallback: true,
    apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
    ui: import.meta.env.VITE_TOLGEE_API_KEY ? UI : undefined,
    apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
    staticData: {
      en: enLang,
      cs: csLang,
      de: deLang,
      fr: frLang
    },
    availableLanguages: ['en', 'de', 'cs', 'fr']
  } as TolgeeConfig;
</script>

<TolgeeProvider config={tolgeeConfig}>
  <div slot="loading-fallback">Loading...</div>
  <slot />
</TolgeeProvider>
