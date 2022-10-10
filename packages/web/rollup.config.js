import { buildMain, buildMinified } from './rollup.common';

export default [
  buildMain(),
  buildMinified('src/index.ts', 'web'),
  // separately built modules intended for vanilla usage
  buildMinified('src/InContextTools.ts', 'in-context-tools'),
  buildMinified('src/TextObserver.ts', 'text-observer'),
  buildMinified('src/InvisibleObserver.ts', 'invisible-observer'),
  buildMinified('src/ContextUi.ts', 'context-ui'),
  buildMinified('src/LanguageStorage.ts', 'language-storage'),
  buildMinified('src/LanguageDetector.ts', 'language-detector'),
  buildMinified('src/WebTolgee.ts', 'web-tolgee'),
  buildMinified('src/BackendFetch.ts', 'backend-fetch'),
  buildMinified('src/BackendFetch.ts', 'backend-fetch'),
  buildMinified('src/LanguageDetector.ts', 'language-detector'),
  buildMinified('src/LanguageStorage.ts', 'language-storage'),
];