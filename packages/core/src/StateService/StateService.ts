import { EventServiceType } from '../EventService';
import {
  BackendGetRecord,
  CacheAsyncRequests,
  CacheDescriptor,
  CacheKeyObject,
  Options,
  StateCache,
  TranslatePropsInternal,
  TreeTranslationsData,
} from '../types';
import {
  cacheAddRecord,
  cacheChangeTranslation,
  cacheExists,
  cacheGetRecord,
  cacheGetTranslationFallback,
  cacheInit,
} from './Cache/Cache';
import { encodeCacheKey } from './Cache/helpers';
import { getFallback, getFallbackFromStruct } from './helpers';
import { initState, State } from './initState';

type StateServiceProps = {
  eventService: EventServiceType;
  backendGetRecord: BackendGetRecord;
  backendGetDevRecord: BackendGetRecord;
  options?: Partial<Options>;
};

export const StateService = ({
  eventService,
  backendGetRecord,
  backendGetDevRecord,
  options,
}: StateServiceProps) => {
  let state: State = initState(options);
  const cache: StateCache = new Map();

  const asyncRequests: CacheAsyncRequests = new Map();

  cacheInit(cache, state.initialOptions.staticData);

  const init = (options: Partial<Options>) => {
    state = initState(options, state.initialOptions);
    cacheInit(cache, state.initialOptions.staticData);
  };

  const isDev = () => {
    return Boolean(state.initialOptions.apiKey);
  };

  const isFetching = () => {
    return asyncRequests.size > 0;
  };

  const isLoading = () => {
    return state.isLoading;
  };

  const getLanguage = () => {
    return state.language;
  };

  const getPendingLanguage = () => {
    return state.pendingLanguage;
  };

  const withDefaultNs = (descriptor: CacheDescriptor): CacheKeyObject => {
    return {
      namespace:
        descriptor.namespace === undefined
          ? state.initialOptions.defaultNs
          : descriptor.namespace,
      language: descriptor.language,
    };
  };

  const addActiveNs = async (namespace: string) => {
    const value = state.activeNamespaces.get(namespace);
    if (value !== undefined) {
      state.activeNamespaces.set(namespace, value + 1);
    } else {
      state.activeNamespaces.set(namespace, 1);
    }
    const data = cacheGetRecord(cache, {
      language: state.language,
      namespace,
    });
    if (!data) {
      await loadRecord({ namespace, language: state.language });
    }
  };

  const removeActiveNs = (ns: string) => {
    const value = state.activeNamespaces.get(ns);
    if (value !== undefined && value > 1) {
      state.activeNamespaces.set(ns, value - 1);
    } else {
      state.activeNamespaces.delete(ns);
    }
  };

  const getFallbackNamespaces = () => {
    const defaultNs = state.initialOptions.defaultNs;
    const fallbackNs = state.initialOptions.fallbackNs;
    const fallbackNamespaces = typeof defaultNs === 'string' ? [defaultNs] : [];
    return [...fallbackNamespaces, ...getFallback(fallbackNs)];
  };

  const getFallbackLangs = (lang?: string) => {
    const language = lang || state.language;
    return [
      language,
      ...getFallbackFromStruct(language, state.initialOptions.fallbackLanguage),
    ];
  };

  const getRequiredNamespaces = () => {
    return Array.from(
      new Set([
        ...(state.initialOptions.ns || [state.initialOptions.defaultNs]),
        ...state.activeNamespaces.keys(),
      ])
    );
  };

  const loadRequiredRecords = async (lang?: string) => {
    const languages = new Set(getFallbackLangs(lang));
    const namespaces = new Set(getRequiredNamespaces());
    const requests: ReturnType<typeof loadRecord>[] = [];
    languages.forEach((language) => {
      namespaces.forEach((namespace) => {
        if (
          !cacheExists(
            cache,
            { language, namespace },
            isDev() ? 'dev' : undefined
          )
        ) {
          requests.push(loadRecord({ language, namespace }));
        }
      });
    });
    await Promise.all(requests);
  };

  const loadInitial = async () => {
    state.isLoading = true;
    await loadRequiredRecords();
    state.isLoading = false;
    eventService.onInitialLoaded.emit();
  };

  const changeLanguage = async (language: string) => {
    if (state.pendingLanguage === language && state.language === language) {
      return;
    }
    state.pendingLanguage = language;
    eventService.onPendingLanguageChange.emit(language);

    await loadRequiredRecords(language);

    if (language === state.pendingLanguage) {
      // there might be parallel language change
      // we only want to apply latest
      state.language = language;
      eventService.onLanguageChange.emit(language);
    }
  };

  const getTranslation = ({
    key,
    ns,
    fallbackLanguages,
  }: TranslatePropsInternal) => {
    const namespaces = ns ? getFallback(ns) : getFallbackNamespaces();
    const languages = fallbackLanguages
      ? [state.language, ...getFallback(fallbackLanguages)]
      : getFallbackLangs();
    return cacheGetTranslationFallback(cache, namespaces, languages, key);
  };

  const changeTranslation = (
    descriptor: CacheDescriptor,
    key: string,
    value: string
  ) => {
    const keyObject = withDefaultNs(descriptor);
    cacheChangeTranslation(cache, keyObject, key, value);
    eventService.onKeyChange.emit(key);
  };

  const fetchData = (keyObject: CacheKeyObject) => {
    let dataPromise = undefined as Promise<TreeTranslationsData> | undefined;
    if (isDev()) {
      dataPromise = backendGetDevRecord(keyObject);
    }

    if (!dataPromise) {
      dataPromise = backendGetRecord(keyObject);
    }

    if (!dataPromise) {
      const staticDataValue =
        state.initialOptions.staticData?.[encodeCacheKey(keyObject)];
      if (typeof staticDataValue === 'function') {
        dataPromise = staticDataValue();
      }
    }
    return dataPromise;
  };

  const loadRecord = async (descriptor: CacheDescriptor) => {
    const keyObject = withDefaultNs(descriptor);
    const cacheKey = encodeCacheKey(keyObject);
    const existingPromise = asyncRequests.get(cacheKey);

    if (existingPromise) {
      return existingPromise;
    }

    const dataPromise = fetchData(keyObject);
    if (dataPromise) {
      const fetchingBefore = isFetching();
      asyncRequests.set(cacheKey, dataPromise);
      if (!fetchingBefore) {
        eventService.onFetchingChange.emit(true);
      }

      const data = await dataPromise;

      asyncRequests.delete(cacheKey);
      cacheAddRecord(cache, keyObject, isDev() ? 'dev' : 'prod', data);
      if (!isFetching()) {
        eventService.onFetchingChange.emit(false);
      }
    }

    return cacheGetRecord(cache, withDefaultNs(descriptor));
  };

  const getBackendProps = () => {
    const apiUrl = state.initialOptions.apiUrl;
    return {
      apiUrl: apiUrl ? apiUrl.replace(/\/+$/, '') : apiUrl,
      apiKey: state.initialOptions.apiKey,
    };
  };

  return Object.freeze({
    init,
    getLanguage,
    getPendingLanguage,
    changeLanguage,
    getTranslation,
    changeTranslation,
    addActiveNs,
    removeActiveNs,
    loadRequiredRecords,
    loadRecord,
    isLoading,
    isFetching,
    loadInitial,
    getBackendProps,
  });
};

export type StateServiceType = ReturnType<typeof StateService>;
