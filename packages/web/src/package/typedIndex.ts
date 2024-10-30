export { ObserverPlugin } from './ObserverPlugin';
export { DevBackend } from './DevBackend';
export { getProjectIdFromApiKey } from './tools/decodeApiKey';
export { BrowserExtensionPlugin } from './BrowserExtensionPlugin/BrowserExtensionPlugin';
export { LanguageStorage } from './LanguageStorage';
export { LanguageDetector, detectLanguage } from './LanguageDetector';
export { detectLanguageFromHeaders } from './tools/detectLanguageFromHeaders';
export { BackendFetch } from './BackendFetch';
export { isSSR } from './tools/isSSR';
export {
  TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE,
  TOLGEE_ATTRIBUTE_NAME,
  TOLGEE_RESTRICT_ATTRIBUTE,
} from './constants';

export * from './types';
export * from '@tolgee/core';
export { Tolgee } from './Tolgee';
