import { TreeTranslationsData } from '..';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ArgumentTypes<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A
  : never;

export const ApiClient = (apiUrl: string, apiKey: string) => {
  const customFetch = async (url: string, params?: RequestInit) => {
    const urlObject = new URL(url, apiUrl || '');
    urlObject.searchParams.append('ak', apiKey);
    const fullUrl = urlObject.href;
    const response = await fetch(fullUrl, params);

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(
        `Tolgee server responded with invalid status code (${response.status}).`
      );
      // create error object and reject if not a 2xx response code
      throw response;
    }
    return response;
  };

  const fetchJson = async (url: string, params?: RequestInit) => {
    return customFetch(url, params).then((res) => res.json());
  };

  const getLanguages = () => {
    return fetchJson('/v2/projects/languages?size=1000');
  };

  const getTranslations = async (language: string, scope: string) => {
    const result = (await fetchJson(`/v2/projects/translations/${language}`))?.[
      language
    ];
    return result as TreeTranslationsData;
  };

  return Object.freeze({
    getLanguages,
    getTranslations,
  });
};

export type ApiClientInstance = ReturnType<typeof ApiClient>;
