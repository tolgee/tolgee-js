import { detectLanguage } from '../LanguageDetector';
import { getHeaderLanguages } from './getHeaderLanguages';

export const detectLanguageFromHeaders = (
  headers: Headers,
  availableLanguages: string[]
) => {
  const languages = getHeaderLanguages(headers);
  return languages[0] && detectLanguage(languages[0], availableLanguages);
};
