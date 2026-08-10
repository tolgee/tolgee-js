export const IN_CONTEXT_FILE = 'tolgee-in-context-tools.umd.min.js';
export const IN_CONTEXT_UMD_NAME = '@tolgee/in-context-tools';
export const IN_CONTEXT_EXPORT_NAME = 'InContextTools';

// The extension injects the (rotating) OAuth access token here; the editor's client reads it live so a long-open page
// always sends a current token. Shared so the read side (client) and the write side (extension plugin) can't drift.
export const AUTH_TOKEN_LOCAL_STORAGE = '__tolgee_authToken';
