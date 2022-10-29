import { buildMain, buildVanilla } from './rollup.common';

export default [
  ...buildMain(),
  // separately built modules intended for vanilla usage
  ...buildVanilla('src/index.ts', 'web'),
  ...buildVanilla('src/InContextTools.ts', 'in-context-tools'),
  ...buildVanilla('src/InContextProduction.ts', 'in-context-production'),
  ...buildVanilla('src/TextObserver.ts', 'text-observer'),
  ...buildVanilla('src/InvisibleObserver.ts', 'invisible-observer'),
  ...buildVanilla('src/LanguageStorage.ts', 'language-storage'),
  ...buildVanilla('src/LanguageDetector.ts', 'language-detector'),
  ...buildVanilla('src/BackendFetch.ts', 'backend-fetch'),
  ...buildVanilla('src/BackendFetch.ts', 'backend-fetch'),
  ...buildVanilla('src/LanguageDetector.ts', 'language-detector'),
  ...buildVanilla('src/LanguageStorage.ts', 'language-storage'),
];
