import * as React from 'react';
import { T, TolgeeProvider } from '@tolgee/react';
import * as translationsEn from '../i18n/en.json';

const IndexPage = () => {
  return (
    <main>
      <div>
        <a href={'/cs'}>CS</a>
      </div>
      <TolgeeProvider
        forceLanguage="en"
        //apiKey={process.env.GATSBY_TOLGEE_API_KEY}
        apiUrl={process.env.GATSBY_TOLGEE_API_URL}
        staticData={{ en: translationsEn }}
      >
        <T>hello_world</T>
      </TolgeeProvider>
    </main>
  );
};

export default IndexPage;
