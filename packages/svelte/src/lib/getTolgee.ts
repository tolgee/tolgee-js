import { readable } from 'svelte/store';
import type { TolgeeEvent } from '@tolgee/web';
import { getTolgeeContext } from './getTolgeeContext';

export const getTolgee = (events?: TolgeeEvent[]) => {
  const tolgeeContext = getTolgeeContext();

  const tolgee = tolgeeContext.tolgee;

  const { subscribe } = readable(tolgee, (set) => {
    const listeners = events?.map((e) =>
      tolgee.on(e, () => {
        set({ ...tolgee });
      })
    );

    return () => listeners?.forEach((listener) => listener.unsubscribe());
  });

  return { subscribe, value: tolgee };
};
