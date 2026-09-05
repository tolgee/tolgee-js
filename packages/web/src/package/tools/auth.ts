import { DevApiTransport, sdkHeaders } from '@tolgee/core';
import { getApiKeyType, getProjectIdFromApiKey } from './decodeApiKey';

export type LiveCredentials = {
  apiKey?: string;
  projectId?: number | string;
  transport?: DevApiTransport;
};

export type ResolvedLiveCredential = {
  authHeader: Record<string, string>;
  viaExtension: boolean;
  hasCredential: boolean;
  projectId: number | string | undefined;
  requiresExplicitProject: boolean;
};

export function resolveLiveCredential(
  credentials: LiveCredentials
): ResolvedLiveCredential {
  const { apiKey, projectId, transport } = credentials;
  if (transport) {
    return {
      authHeader: {},
      viaExtension: true,
      hasCredential: true,
      projectId,
      requiresExplicitProject: true,
    };
  }
  return {
    authHeader: buildAuthHeader(apiKey),
    viaExtension: false,
    hasCredential: Boolean(apiKey),
    projectId: getProjectIdFromApiKey(apiKey) ?? projectId,
    requiresExplicitProject: getApiKeyType(apiKey) === 'tgpat',
  };
}

export function buildAuthHeader(
  apiKey: string | undefined
): Record<string, string> {
  return apiKey ? { 'X-API-Key': apiKey } : {};
}

// createFetchFunction (@tolgee/core) adds these on a direct request already; a request routed through the
// extension's transport bypasses that wrapper, so they have to be added here instead.
export function extensionSdkHeaders(
  viaExtension: boolean
): Record<string, string> {
  return viaExtension ? sdkHeaders() : {};
}
