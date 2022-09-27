<script lang="ts">
  import { TolgeeProvider, Tolgee, SveltePlugin } from '@tolgee/svelte';
  import { FormatIcu } from '@tolgee/format-icu'

  const tolgee = Tolgee().use(SveltePlugin()).use(FormatIcu()).init({
    apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
    apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
    language: 'en',
    staticData: {
      en: () => import('../i18n/en.json').then((m) => m.default),
      de: () => import('../i18n/de.json').then((m) => m.default),
      cs: () => import('../i18n/cs.json').then((m) => m.default),
      fr: () => import('../i18n/fr.json').then((m) => m.default),
      'en:base': () => import('../i18n/en/base.json').then(m => m.default),
      'en:test1': () => import('../i18n/en/test1.json').then(m => m.default),
      'en:test2': () => import('../i18n/en/test2.json').then(m => m.default),
      'en:test3': () => import('../i18n/en/test3.json').then(m => m.default),
      'cs:base': () => import('../i18n/cs/base.json').then(m => m.default),
      'cs:test1': () => import('../i18n/cs/test1.json').then(m => m.default),
      'cs:test2': () => import('../i18n/cs/test2.json').then(m => m.default),
      'cs:test3': () => import('../i18n/cs/test3.json').then(m => m.default),
      'de:base': () => import('../i18n/de/base.json').then(m => m.default),
      'de:test1': () => import('../i18n/de/test1.json').then(m => m.default),
      'de:test2': () => import('../i18n/de/test2.json').then(m => m.default),
      'de:test3': () => import('../i18n/de/test3.json').then(m => m.default),
      'fr:base': () => import('../i18n/fr/base.json').then(m => m.default),
      'fr:test1': () => import('../i18n/fr/test1.json').then(m => m.default),
      'fr:test2': () => import('../i18n/fr/test2.json').then(m => m.default),
      'fr:test3': () => import('../i18n/fr/test3.json').then(m => m.default),
    },
    availableLanguages: ['en', 'de', 'cs', 'fr'],
  }); 
</script>

<TolgeeProvider tolgee={tolgee}>
  <div slot="loading-fallback">Loading...</div>
  <slot />
</TolgeeProvider>
