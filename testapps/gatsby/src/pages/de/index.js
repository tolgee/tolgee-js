import * as React from 'react';
import { TolgeeProvider } from '@tolgee/react';
import * as translationsEn from '../../i18n/en.json';
import * as translationsDe from '../../i18n/de.json';
import { HelloWorld } from '../../component/helloWorld';
import UI from '../../../../../packages/ui/src';

const IndexPage = () => {
  return (
    <main>
      <div>
        <a href={'/'}>EN</a>
      </div>
      <TolgeeProvider
        forceLanguage="de"
        ui={UI}
        apiKey={process.env.GATSBY_TOLGEE_API_KEY}
        apiUrl={process.env.GATSBY_TOLGEE_API_URL}
        staticData={{
          en: translationsEn,
          de: translationsDe,
        }}
      >
        <HelloWorld />
      </TolgeeProvider>
    </main>
  );
};

export default IndexPage;
