import * as React from 'react';
import { T, TolgeeProvider } from '@tolgee/react';
import * as translationsEn from '../../i18n/en.json';
import * as translationsCs from '../../i18n/cs.json';

const IndexPage = () => {
  return (
    <main>
      <div>
        <a href={'/'}>EN</a>
      </div>
      <TolgeeProvider
        forceLanguage="cs"
        //apiKey={process.env.GATSBY_TOLGEE_API_KEY}
        apiUrl={process.env.GATSBY_TOLGEE_API_URL}
        staticData={{
          en: translationsEn,
          cs: translationsCs,
        }}
      >
        <T>hello_world</T>
      </TolgeeProvider>
    </main>
  );
};

export default IndexPage;
