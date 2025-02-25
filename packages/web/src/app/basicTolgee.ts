import { TolgeeEvent, TolgeeInstance } from '@tolgee/core';
import { FormatIcu } from '@tolgee/format-icu';
import { useCallback, useEffect, useState } from 'react';
import { BackendFetch, DevTools, Tolgee } from '../package/entry-development';

export const ALL_LOCALES = ['en', 'de'];

export const secrets = {
  apiUrl: import.meta.env.VITE_APP_TOLGEE_API_URL,
  apiKey: import.meta.env.VITE_APP_TOLGEE_API_KEY,
};

const apiKeyFromUrl = new URLSearchParams(window.location.search).get(
  'api_key'
);

export const tolgee = Tolgee()
  .use(DevTools())
  .use(BackendFetch())
  .use(FormatIcu())
  .init({
    apiUrl: secrets.apiUrl,
    apiKey: apiKeyFromUrl || secrets.apiKey,
    availableLanguages: ALL_LOCALES,
    defaultLanguage: 'en',
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
