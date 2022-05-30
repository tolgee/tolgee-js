import { Translations } from '..';
import { TreeTranslationsData } from '../types';

export function translationsToFlat(data: TreeTranslationsData): Translations {
  const result: Translations = {};
  Object.entries(data).forEach(([key, value]) => {
    // ignore falsy values
    if (!value) {
      return;
    }
    if (typeof value === 'object') {
      Object.entries(translationsToFlat(value)).forEach(
        ([flatKey, flatValue]) => {
          result[key + '.' + flatKey] = flatValue;
        }
      );
      return;
    }
    result[key] = value as string;
  });
  return result;
}
