import { Writable, writable } from 'svelte/store';
import { getTolgeeContext } from '$lib/index';

export const getLanguageStore = (): Writable<string> => {
  const context = getTolgeeContext();

  const store = writable(context.tolgee.lang);

  context.tolgee.onLangChange.subscribe((lang) => {
    store.set(lang);
  });

  store.subscribe((lang) => {
    context.tolgee.lang = lang;
  });

  return store;
};
