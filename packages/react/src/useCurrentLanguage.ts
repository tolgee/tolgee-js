import { useTolgeeContext } from './useTolgeeContext';
import { useEffect, useState } from 'react';

/**
 * Custom react hook
 * @return function accepting language abbreviation as parameter
 */
export const useCurrentLanguage = () => {
  const context = useTolgeeContext();

  //to make react rerender components which are using current language
  const [language, setLanguage] = useState(context.tolgee.lang);

  useEffect(() => {
    const subscription = context.tolgee.onLangChange.subscribe((lang) => {
      setLanguage(lang);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return () => {
    return language;
  };
};
