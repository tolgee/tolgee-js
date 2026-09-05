// Mirror of the browser extension's src/protocol.ts (tolgee/chrome-plugin): the two repos release independently, so
// every value here has to stay compatible with what shipped extensions do.

// Reported in TOLGEE_READY; the extension refuses to sign a page in via OAuth below protocol 2, the version that
// sends its Tolgee API requests through the extension. An API key entered in the extension's popup is still handed
// to an older SDK via 'page' delivery.
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

export type ExtensionSessionKind = 'oauth' | 'apiKey';

export const EXTENSION_SESSION_KINDS: readonly ExtensionSessionKind[] = [
  'oauth',
  'apiKey',
];

export const isExtensionSessionKind = (
  value: string | null | undefined
): value is ExtensionSessionKind =>
  EXTENSION_SESSION_KINDS.includes(value as ExtensionSessionKind);
