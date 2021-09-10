import * as React from 'react';
import { TolgeeProvider } from '@tolgee/react';
import * as translationsEn from '../i18n/en.json';
import { HelloWorld } from '../component/helloWorld';
import UI from '../../../../packages/ui/src';

const IndexPage = () => {
  return (
    <main>
      <div>
        <a href={'/de'}>DE</a>
      </div>
      <TolgeeProvider
        ui={UI}
        forceLanguage="en"
        apiKey={process.env.GATSBY_TOLGEE_API_KEY}
        apiUrl={process.env.GATSBY_TOLGEE_API_URL}
        staticData={{ en: translationsEn }}
      >
        <HelloWorld />
      </TolgeeProvider>
    </main>
  );
};

export default IndexPage;
