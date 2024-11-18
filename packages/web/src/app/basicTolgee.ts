import { TolgeeEvent, TolgeeInstance } from '@tolgee/core';
import { useCallback, useEffect, useState } from 'react';
import { BackendFetch, DevTools, Tolgee } from '../package/entry-development';

export const secrets = {
  apiUrl: import.meta.env.VITE_APP_TOLGEE_API_URL,
  apiKey: import.meta.env.VITE_APP_TOLGEE_API_KEY,
};

export const tolgee = Tolgee()
  .use(DevTools())
  .use(BackendFetch())
  .init({
    ...secrets,
    availableLanguages: ['en', 'cs', 'fr', 'de'],
    defaultLanguage: 'en',
    tagNewKeys: ['draft'],
    filterTag: ['test'],
  });

export const useTolgee = (events?: TolgeeEvent[]): TolgeeInstance => {
  const [_, setCounter] = useState(0);

  const rerender = useCallback(() => {
    setCounter((num) => num + 1);
  }, [setCounter]);

  useEffect(() => {
    const listeners = events?.map((e) => tolgee.on(e, rerender));
    return () => {
      listeners?.forEach((listener) => listener.unsubscribe());
    };
  }, [events?.join(':')]);

  return tolgee;
};
