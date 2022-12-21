import { ChangeTranslationInterface } from '@tolgee/core';
import {
  MAX_LANGUAGES_SELECTED,
  PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY,
} from '../../../constants';

export function getPreferredLanguages(): string[] {
  try {
    return JSON.parse(
      localStorage.getItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY) || ''
    );
  } catch {
    return [];
  }
}

export function setPreferredLanguages(languages: string[]) {
  localStorage.setItem(
    PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY,
    JSON.stringify(languages)
  );
}

export function getInitialLanguages(available: string[]) {
  const preferred = getPreferredLanguages();
  let langs = preferred.filter((l) => available.includes(l));
  if (langs.length === 0) {
    langs = available;
  }
  return langs.slice(0, MAX_LANGUAGES_SELECTED);
}

export const changeInTolgeeCache = (
  key: string,
  ns: string | undefined,
  values: [language: string, value: string][],
  changeTranslation: ChangeTranslationInterface
) => {
  const changers = values.map(([language, value]) =>
    changeTranslation(
      {
        language,
        namespace: ns,
      },
      key,
      value
    )
  );
  return { revert: () => changers.forEach((ch) => ch.revert()) };
};
