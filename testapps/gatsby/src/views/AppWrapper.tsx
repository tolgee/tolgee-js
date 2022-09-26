/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState } from 'react';
import { ReactPlugin, Tolgee, TolgeeProvider } from '@tolgee/react';
import { IcuPlugin } from '@tolgee/icu-formatter';
import { useIntl } from 'gatsby-plugin-react-intl';
import '../style/style.css';

export const AppWrapper: React.FC = ({ children }) => {
  const { locale, messages } = useIntl();

  const [tolgee] = useState(
    Tolgee()
      .use(ReactPlugin())
      .use(IcuPlugin())
      .init({
        language: locale,
        apiKey: process.env.GATSBY_TOLGEE_API_KEY,
        apiUrl: process.env.GATSBY_TOLGEE_API_URL,
        fallbackLanguage: 'en',
        staticData: {
          de: () => import('../i18n/de.json'),
          cs: () => import('../i18n/cs.json'),
          fr: () => import('../i18n/fr.json'),
          en: () => import(`../i18n/en.json`),
          // translations provided by intl plugin
          [locale]: messages as Record<string, string>,
        },
      })
  );

  return (
    <TolgeeProvider tolgee={tolgee} fallback={<div>Loading...</div>}>
      {children}
    </TolgeeProvider>
  );
};
