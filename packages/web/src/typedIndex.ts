export { InvisibleObserver } from './InvisibleObserver';
export { TextObserver } from './TextObserver';
export { DevBackend } from './DevBackend';
export { getProjectIdFromApiKey } from './tools/decodeApiKey';
export { BrowserExtensionPlugin } from './BrowserExtensionPlugin/BrowserExtensionPlugin';
export { LanguageStorage } from './LanguageStorage';
export { LanguageDetector } from './LanguageDetector';
export { BackendFetch } from './BackendFetch';

export * from './types';
export * from '@tolgee/core';
// Tolgee with injected browser extension plugin
export { Tolgee, TolgeeCore } from './WebTolgee';
