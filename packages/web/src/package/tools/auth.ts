import { sdkHeaders } from '@tolgee/core';
import { getApiKeyType, getProjectIdFromApiKey } from './decodeApiKey';
import { AUTH_TOKEN_SESSION_STORAGE } from './sessionStorageKeys';

type Credentials = {
  apiKey?: string;
  authToken?: string;
  projectId?: number | string;
};

export function resolveCredential(credentials: Credentials): {
  authHeader: Record<string, string>;
  hasCredential: boolean;
  projectId: number | string | undefined;
  requiresExplicitProject: boolean;
} {
  const { apiKey, authToken, projectId } = credentials;
  const token = resolveLiveAuthToken(authToken, apiKey);
  const hasToken = Boolean(token);
  const hasApiKey = Boolean(apiKey);
  const embedded = !hasToken ? getProjectIdFromApiKey(apiKey) : undefined;
  return {
    authHeader: buildAuthHeader(token, apiKey),
    hasCredential: hasToken || hasApiKey,
    projectId: embedded ?? projectId,
    requiresExplicitProject: hasToken || getApiKeyType(apiKey) === 'tgpat',
  };
}

export function resolveLiveAuthToken(
  initAuthToken: string | undefined,
  apiKey: string | undefined
): string | undefined {
  // An api-key-configured SDK must not be hijacked by a stray sessionStorage token: only follow the live token when a
  // token is the intended auth path.
  if (!initAuthToken && apiKey) {
    return undefined;
  }
  try {
    if (typeof sessionStorage !== 'undefined') {
      const injected = sessionStorage.getItem(AUTH_TOKEN_SESSION_STORAGE);
      if (injected) {
        return injected;
      }
    }
  } catch {
    // sessionStorage can throw (SSR, sandboxed iframes).
  }
  return initAuthToken;
}

export function buildAuthHeader(
  authToken: string | undefined,
  apiKey: string | undefined
): Record<string, string> {
  if (authToken) {
    return { Authorization: `Bearer ${authToken}` };
  }
  if (apiKey) {
    return { 'X-API-Key': apiKey };
  }
  return {};
}

export function bearerSdkHeaders(
  authHeader: Record<string, string>
): Record<string, string> {
  return authHeader.Authorization ? sdkHeaders() : {};
}
