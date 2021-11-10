/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { TolgeeProvider } from '@tolgee/react';
import { useIntl } from 'gatsby-plugin-intl';
import '../style/style.css';

import * as translationsEn from '../i18n/en.json';
import * as translationsDe from '../i18n/de.json';
import * as translationsCs from '../i18n/cs.json';
import * as translationsFr from '../i18n/fr.json';

export const AppWrapper: React.FC = ({ children }) => {
  const intl = useIntl();

  return (
    <TolgeeProvider
      forceLanguage={intl.locale}
      apiKey={process.env.GATSBY_TOLGEE_API_KEY}
      apiUrl={process.env.GATSBY_TOLGEE_API_URL}
      staticData={{
        en: translationsEn,
        de: translationsDe,
        cs: translationsCs,
        fr: translationsFr,
      }}
      loadingFallback={<div>Loading...</div>}
      ui={
        process.env.GATSBY_TOLGEE_API_KEY ? require('@tolgee/ui').UI : undefined
      }
    >
      {children}
    </TolgeeProvider>
  );
};
