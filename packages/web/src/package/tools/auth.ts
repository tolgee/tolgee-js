import { DevApiTransport, sdkHeaders } from '@tolgee/core';
import { getApiKeyType, getProjectIdFromApiKey } from './decodeApiKey';

type Credentials = {
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
  credentials: Credentials
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

// The fetch wrapper adds these on an api-key request itself; a request through the extension carries no api key.
export function bearerSdkHeaders(
  viaExtension: boolean
): Record<string, string> {
  return viaExtension ? sdkHeaders() : {};
}
