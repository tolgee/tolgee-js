import { BackendDevMiddleware, TolgeePlugin } from '@tolgee/core';
import { createUrl } from './tools/url';
import { resolveCredential } from './tools/auth';

function createDevBackend(): BackendDevMiddleware {
  return {
    getRecord({
      apiUrl,
      apiKey,
      authToken,
      projectId,
      branch,
      language,
      namespace,
      filterTag,
      fetch,
    }) {
      const {
        authHeader,
        projectId: pId,
        requiresExplicitProject,
      } = resolveCredential({ apiKey, authToken, projectId });
      if (requiresExplicitProject && pId === undefined) {
        throw new Error(
          "You need to specify 'projectId' when using a PAT key or an OAuth token"
        );
      }

      let url: URL;
      if (pId !== undefined) {
        url = createUrl(apiUrl, `/v2/projects/${pId}/translations/${language}`);
      } else {
        url = createUrl(apiUrl, `/v2/projects/translations/${language}`);
      }

      if (branch) {
        url.searchParams.append('branch', branch);
      }
      if (namespace) {
        url.searchParams.append('ns', namespace);
      }
      filterTag?.forEach((tag) => {
        url.searchParams.append('filterTag', tag);
      });

      return fetch(url.toString(), {
        headers: {
          ...authHeader,
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
