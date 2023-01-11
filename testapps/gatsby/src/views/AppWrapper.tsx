/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useMemo } from 'react';
import { DevTools, Tolgee, TolgeeProvider } from '@tolgee/react';
import { FormatIcu } from '@tolgee/format-icu';
import { useIntl } from 'gatsby-plugin-react-intl';
import '../style/style.css';

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatIcu())
  .init({
    defaultLanguage: 'en',
    apiKey: process.env.GATSBY_TOLGEE_API_KEY,
    apiUrl: process.env.GATSBY_TOLGEE_API_URL,
    staticData: {
      de: () => import('../i18n/de.json'),
      cs: () => import('../i18n/cs.json'),
      fr: () => import('../i18n/fr.json'),
      en: () => import(`../i18n/en.json`),
    },
  });

export const AppWrapper: React.FC = ({ children }) => {
  const { locale, messages } = useIntl();

  useMemo(() => {
    // set language and static data, without emitting events
    tolgee.setEmmiterActive(false);
    tolgee.changeLanguage(locale);
    tolgee.addStaticData({ [locale]: messages as Record<string, string> });
    tolgee.setEmmiterActive(true);
  }, [locale, messages]);

  return (
    <TolgeeProvider
      tolgee={tolgee}
      fallback={<div>Loading...</div>}
      options={{ useSuspense: false }}
    >
      {children}
    </TolgeeProvider>
  );
};
