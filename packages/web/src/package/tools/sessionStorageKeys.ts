// clearSessionStorage() deletes every sessionStorage key under this prefix wholesale (BrowserExtensionPlugin.ts).
// Reserved for the browser extension: no SDK code may store anything in sessionStorage under this prefix, or it
// will be silently wiped on every handshake failure.
export const TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX = '__tolgee_';

export const API_KEY_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}apiKey`;
export const API_URL_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}apiUrl`;
export const BRANCH_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}branch`;
export const PROJECT_ID_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}projectId`;
export const AUTH_TOKEN_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}authToken`;
