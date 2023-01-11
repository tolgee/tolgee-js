import { buildMain, buildVanilla } from './rollup.common';

export default [
  ...buildMain(),
  // separately built modules intended for vanilla usage
  ...buildVanilla('src/index.ts', 'web'),
  ...buildVanilla('src/InContextTools.ts', 'in-context-tools'),
  ...buildVanilla('src/ObserverPlugin.ts', 'observer-plugin'),
  ...buildVanilla('src/Tolgee.ts', 'tolgee'),
  ...buildVanilla('src/LanguageStorage.ts', 'language-storage'),
  ...buildVanilla('src/LanguageDetector.ts', 'language-detector'),
  ...buildVanilla('src/BackendFetch.ts', 'backend-fetch'),
  ...buildVanilla('src/BackendFetch.ts', 'backend-fetch'),
  ...buildVanilla('src/LanguageDetector.ts', 'language-detector'),
  ...buildVanilla('src/LanguageStorage.ts', 'language-storage'),
];
