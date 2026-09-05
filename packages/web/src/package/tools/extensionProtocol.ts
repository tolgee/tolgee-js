// Mirror of the browser extension's src/protocol.ts (tolgee/chrome-plugin): the two repos release independently, so
// every value here has to stay compatible with what shipped extensions do.

// Reported in TOLGEE_READY: this SDK sends its Tolgee API requests through the extension.
export const EXTENSION_PROTOCOL_VERSION = 2;

// Must stay above the extension's PROXY_BUDGET_MS: the worker's refresh-and-retry could otherwise still be in
// flight when this timer gives up.
export const EXTENSION_REQUEST_TIMEOUT_MS = 35_000;

export type ExtensionErrorKind =
  | 'no_session'
  | 'not_allowed'
  | 'too_large'
  | 'network'
  | 'timeout'
  | 'unavailable';

export type ProxyFormEntry =
  | { name: string; value: string }
  | { name: string; file: { name: string; type: string; base64: string } };

export type ProxyBody =
  | { kind: 'none' }
  | { kind: 'json'; text: string }
  | { kind: 'form'; entries: ProxyFormEntry[] };

export const TOLGEE_API_REQUEST = 'TOLGEE_API_REQUEST';
export const TOLGEE_API_RESPONSE = 'TOLGEE_API_RESPONSE';
export const TOLGEE_SCREENSHOT_UPLOAD = 'TOLGEE_SCREENSHOT_UPLOAD';
export const TOLGEE_SCREENSHOT_UPLOADED = 'TOLGEE_SCREENSHOT_UPLOADED';
export const TOLGEE_SCREENSHOT_CAPTURED = 'TOLGEE_SCREENSHOT_CAPTURED';
export const TOLGEE_PROXY_PING = 'TOLGEE_PROXY_PING';
export const TOLGEE_PROXY_PONG = 'TOLGEE_PROXY_PONG';

export type ExtensionSessionKind = 'oauth' | 'apiKey';

export function isExtensionSessionKind(
  value: string | null | undefined
): value is ExtensionSessionKind {
  return value === 'oauth' || value === 'apiKey';
}
