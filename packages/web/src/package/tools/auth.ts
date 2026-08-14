import { getApiKeyType, getProjectIdFromApiKey } from './decodeApiKey';
import { AUTH_TOKEN_LOCAL_STORAGE } from './sessionStorageKeys';

export function resolveLiveAuthToken(
  fallback: string | undefined,
  apiKey: string | undefined
): string | undefined {
  // An api-key-configured SDK must not be hijacked by a stray sessionStorage token: only follow the live token when a
  // token (fallback) is the intended auth path.
  if (fallback === undefined && apiKey !== undefined) {
    return undefined;
  }
  try {
    if (typeof sessionStorage !== 'undefined') {
      const injected = sessionStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE);
      if (injected) {
        return injected;
      }
    }
  } catch {
    // sessionStorage can throw (SSR, sandboxed iframes).
  }
  return fallback;
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
  // Treat an empty string as no credential: buildAuthHeader emits no header for it, so keying off `!== undefined` would
  // report hasCredential (and dispatch an unauthenticated request) and skip embedded-project resolution for `''`.
  const hasToken = Boolean(token);
  const hasApiKey = Boolean(apiKey);
  // embedded project applies only when the PAK itself is the active credential
  const embedded = !hasToken ? getProjectIdFromApiKey(apiKey) : undefined;
  return {
    authHeader: buildAuthHeader(token, apiKey),
    hasCredential: hasToken || hasApiKey,
    projectId: embedded ?? projectId,
    requiresExplicitProject: hasToken || getApiKeyType(apiKey) === 'tgpat',
  };
}
