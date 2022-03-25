/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { TolgeeProvider } from '@tolgee/react';
import { useIntl } from 'gatsby-plugin-react-intl';
import '../style/style.css';

export const AppWrapper: React.FC = ({ children }) => {
  const { locale, messages } = useIntl();

  return (
    <TolgeeProvider
      forceLanguage={locale}
      apiKey={process.env.GATSBY_TOLGEE_API_KEY}
      apiUrl={process.env.GATSBY_TOLGEE_API_URL}
      fallbackLanguage="en"
      // remove this to enable language auto detection
      enableLanguageDetection={false}
      staticData={{
        de: () => import('../i18n/de.json'),
        cs: () => import('../i18n/cs.json'),
        fr: () => import('../i18n/fr.json'),
        en: () => import(`../i18n/en.json`),
        // translations provided by intl plugin
        [locale]: messages as Record<string, string>,
      }}
      loadingFallback={<div>Loading...</div>}
    >
      {children}
    </TolgeeProvider>
  );
};
