// The page slots the browser extension writes and this SDK reads. Mirror of the extension's src/sessionStorageKeys.ts
// (tolgee/chrome-plugin): the two repos release independently, so every name here has to stay the one shipped
// extensions write.

// Reserved for the browser extension: no SDK code may store anything in sessionStorage under this prefix, or it
// will be silently wiped on every handshake failure (see clearSessionStorage in BrowserExtensionPlugin.ts).
export const TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX = '__tolgee_';

export const API_KEY_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}apiKey`;
export const API_URL_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}apiUrl`;
export const BRANCH_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}branch`;
export const PROJECT_ID_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}projectId`;
export const EXTENSION_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}session`;
// 'off' while the user has switched in-context editing off for this page in the extension's popup.
export const EDITING_SESSION_STORAGE = `${TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX}editing`;
