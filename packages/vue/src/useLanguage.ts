import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { TolgeeContext } from './types';

export const useLanguage = () => {
  const tolgeeContext = inject('tolgeeContext') as TolgeeContext;

  const lang = ref(tolgeeContext.tolgee.lang);

  let langSub;
  onMounted(() => {
    const tolgee = tolgeeContext.tolgee;
    langSub = tolgee.onLangChange.subscribe((newLang) => {
      lang.value = newLang;
    });
  });

  onUnmounted(() => {
    langSub?.unsubscribe();
  });

  watch(lang, (val) => {
    if (val !== tolgeeContext.tolgee.lang) {
      tolgeeContext.tolgee.changeLanguage(val);
    }
  });

  return lang;
};
