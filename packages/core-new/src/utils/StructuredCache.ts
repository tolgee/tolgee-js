type CacheType<T> = Map<string, Map<string, T>>;

export const StructuredCache = <T>() => {
  const cache: CacheType<T> = new Map();

  const getValue = (language: string, scope: string) => {
    return cache.get(language)?.get(scope);
  };

  const setValue = (language: string, scope: string, value: T) => {
    let langStruct = cache.get(language);
    if (!langStruct) {
      langStruct = new Map();
      cache.set(language, langStruct);
    }
    langStruct.set(scope, value);
  };

  return Object.freeze({ getValue, setValue });
};
