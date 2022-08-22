import {
  CacheKeyObject,
  TreeTranslationsData,
  CacheDescriptor,
} from '../../types';

export const flattenTranslations = (
  data: TreeTranslationsData
): Map<string, string> => {
  const result: Map<string, string> = new Map();
  Object.entries(data).forEach(([key, value]) => {
    // ignore empty values
    if (value === undefined || value === null) {
      return;
    }
    if (typeof value === 'object') {
      Object.entries(flattenTranslations(value)).forEach(
        ([flatKey, flatValue]) => {
          result.set(key + '.' + flatKey, flatValue);
        }
      );
      return;
    }
    result.set(key, value as string);
  });
  return result;
};

export const decodeCacheKey = (key: string): CacheKeyObject => {
  const [firstPart, secondPart] = key.split(':');
  return { language: firstPart, namespace: secondPart || '' };
};

export const encodeCacheKey = ({ language, namespace }: CacheDescriptor) => {
  if (namespace) {
    return `${language}:${namespace}`;
  } else {
    return language;
  }
};

export const normalizeCacheKey = (key: string) => {
  return encodeCacheKey(decodeCacheKey(key));
};
