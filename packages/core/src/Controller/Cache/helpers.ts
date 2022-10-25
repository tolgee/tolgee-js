import { CacheDescriptorInternal, TreeTranslationsData } from '../../types';

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
      flattenTranslations(value).forEach((flatValue, flatKey) => {
        result.set(key + '.' + flatKey, flatValue);
      });
      return;
    }
    result.set(key, value as string);
  });
  return result;
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
