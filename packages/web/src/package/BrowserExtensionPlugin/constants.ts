export const IN_CONTEXT_FILE = 'tolgee-in-context-tools.umd.min.js';
export const IN_CONTEXT_UMD_NAME = '@tolgee/in-context-tools';
export const IN_CONTEXT_EXPORT_NAME = 'InContextTools';

// Window message the in-context editor posts to ask the browser extension to open its popup (so the user can re-connect
// after their OAuth session expired). The extension's content script listens for it.
export const OPEN_PLUGIN_MESSAGE = 'TOLGEE_OPEN_PLUGIN';
