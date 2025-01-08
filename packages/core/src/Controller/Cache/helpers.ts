import {
  CacheDescriptorInternal,
  TranslationsFlat,
  TreeTranslationsData,
} from '../../types';

export const flattenTranslationsToMap = (
  data: TreeTranslationsData
): Map<string, string> => {
  const result: Map<string, string> = new Map();
  Object.entries(data).forEach(([key, value]) => {
    // ignore empty values
    if (value === undefined || value === null) {
      return;
    }
    if (typeof value === 'object') {
      flattenTranslationsToMap(value).forEach((flatValue, flatKey) => {
        result.set(key + '.' + flatKey, flatValue);
      });
      return;
    }
    result.set(key, value as string);
  });
  return result;
};

export const flattenTranslations = (
  data: TreeTranslationsData
): TranslationsFlat => {
  return Object.fromEntries(flattenTranslationsToMap(data).entries());
};
export const decodeCacheKey = (key: string): CacheDescriptorInternal => {
  const [firstPart, ...rest] = key.split(':');
  // if namespaces contains ":" it won't get lost
  const secondPart = rest.join(':');
  return { language: firstPart, namespace: secondPart || '' };
};

export const encodeCacheKey = ({
  language,
  namespace,
}: CacheDescriptorInternal) => {
  if (namespace) {
    return `${language}:${namespace}`;
  } else {
    return language;
  }
};
