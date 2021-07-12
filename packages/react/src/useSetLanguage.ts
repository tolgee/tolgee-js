import { useTolgeeContext } from './useTolgeeContext';

/**
 * Custom react hook
 * @return function accepting language abbreviation as parameter
 */
export const useSetLanguage = () => {
  const context = useTolgeeContext();
  return (language: string) => {
    context.tolgee.lang = language;
  };
};
