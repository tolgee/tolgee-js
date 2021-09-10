import React from 'react';
import './App.css';
import { TolgeeProvider } from '@tolgee/react';
import { UI } from '@tolgee/ui';
import { Page } from './Page';

const App = () => {
  return (
    <TolgeeProvider
      staticData={{
        en: () => import('./i18n/en.json'),
        de: () => import('./i18n/de.json'),
      }}
      apiUrl={process.env.REACT_APP_TOLGEE_API_URL}
      apiKey={process.env.REACT_APP_TOLGEE_API_KEY}
      ui={UI}
      availableLanguages={['en', 'de']}
      loadingFallback={
        <div
          style={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Loading...
        </div>
      }
    >
      <div
        style={{
          width: '800px',
          margin: '0 auto 0 auto',
          textAlign: 'center',
          paddingTop: '20px',
        }}
      >
        <Page />
      </div>
    </TolgeeProvider>
  );
};

export default App;
