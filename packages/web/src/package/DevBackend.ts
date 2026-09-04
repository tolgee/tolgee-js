import { BackendDevMiddleware, TolgeePlugin } from '@tolgee/core';
import { directTransport } from './tools/apiTransport';
import { bearerSdkHeaders, resolveLiveCredential } from './tools/auth';

function createDevBackend(): BackendDevMiddleware {
  return {
    getRecord({
      apiUrl,
      apiKey,
      transport,
      projectId,
      branch,
      language,
      namespace,
      filterTag,
      fetch,
    }) {
      const {
        authHeader,
        viaExtension,
        projectId: resolvedProjectId,
        requiresExplicitProject,
      } = resolveLiveCredential({ apiKey, projectId, transport });
      if (requiresExplicitProject && resolvedProjectId === undefined) {
        throw new Error(
          "You need to specify 'projectId' when using a PAT key or signing in through the Tolgee browser extension"
        );
      }

      const path =
        resolvedProjectId !== undefined
          ? `/v2/projects/${resolvedProjectId}/translations/${language}`
          : `/v2/projects/translations/${language}`;
      const query = new URLSearchParams();
      if (branch) {
        query.append('branch', branch);
      }
      if (namespace) {
        query.append('ns', namespace);
      }
      filterTag?.forEach((tag) => {
        query.append('filterTag', tag);
      });
      const search = query.toString();

      const send =
        transport ??
        directTransport({ apiUrl: apiUrl ?? '', fetch, authHeader });
      return send({
        path: search ? `${path}?${search}` : path,
        method: 'GET',
        headers: {
          ...bearerSdkHeaders(viaExtension),
          'Content-Type': 'application/json',
        },
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
