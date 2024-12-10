import { BackendDevMiddleware, TolgeePlugin } from '@tolgee/core';
import { getApiKeyType, getProjectIdFromApiKey } from './tools/decodeApiKey';
import { createUrl } from './tools/url';

function createDevBackend(): BackendDevMiddleware {
  return {
    getRecord({
      apiUrl,
      apiKey,
      language,
      namespace,
      projectId,
      filterTag,
      fetch,
    }) {
      const pId = getProjectIdFromApiKey(apiKey) ?? projectId;
      let url: URL;
      if (pId !== undefined) {
        url = createUrl(apiUrl, `/v2/projects/${pId}/translations/${language}`);
      } else {
        url = createUrl(apiUrl, `/v2/projects/translations/${language}`);
      }

      if (namespace) {
        url.searchParams.append('ns', namespace);
      }
      filterTag?.forEach((tag) => {
        url.searchParams.append('filterTag', tag);
      });

      if (getApiKeyType(apiKey) === 'tgpat' && projectId === undefined) {
        throw new Error("You need to specify 'projectId' when using PAT key");
      }

      return fetch(url.toString(), {
        headers: {
          'X-API-Key': apiKey || '',
          'Content-Type': 'application/json',
        },
        // @ts-ignore - tell next.js to not use cache
        next: { revalidate: 0 },
      }).then((r) => {
        if (r.ok) {
          return r.json().then((data) => data[language]);
        } else {
          throw new Error(r.statusText);
        }
      });
    },
  };
}

export const DevBackend = (): TolgeePlugin => (tolgee, tools) => {
  tools.setDevBackend(createDevBackend());
  return tolgee;
};
