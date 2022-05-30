import { Translations } from '../types';
import { StructuredCache } from './StructuredCache';

export const TranslationsCache = () => {
  const cache = StructuredCache<Translations>();
  const loadingIndicator = StructuredCache<boolean>();

  const insert = async (
    language: string,
    scope: string,
    dataPromise: Promise<Translations>
  ) => {
    loadingIndicator.setValue(language, scope, true);
    try {
      const data = await dataPromise;
      cache.setValue(language, scope, data);
    } finally {
      loadingIndicator.setValue(language, scope, false);
    }
  };

  const isLoading = (language: string, scope: string) => {
    return Boolean(loadingIndicator.getValue(language, scope));
  };

  const getInstant = (language: string, scope: string) => {
    return cache.getValue(language, scope);
  };

  return Object.freeze({
    insert,
    isLoading,
    getInstant,
  });
};

export type TranslationsCacheInstance = ReturnType<typeof TranslationsCache>;
