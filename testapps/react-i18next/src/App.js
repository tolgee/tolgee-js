import { Tolgee } from '@tolgee/core';
import i18n from 'i18next';
import ICU from 'i18next-icu';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UI } from '@tolgee/ui';
import { useTranslation, initReactI18next, Trans } from 'react-i18next';
import './App.css';
import { decodeFromText, encodeMessage } from './secret';

i18n
  .use(ICU)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    lng: 'en',
    resources: {},
  });

const tolgee = new Tolgee({
  apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
  apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
  ui: UI,
  defaultLanguage: i18n.language,
});

tolgee.run();

function App() {
  const { t } = useTranslation();
  const tRef = useRef(null);
  const [value, setValue] = useState(1);

  const updateLanguage = useCallback(async (lang) => {
    await tolgee.translate('random');
    const translations = tolgee.translationService.translationsCache.get(lang);
    for (const [key, value] of Object.entries(translations)) {
      i18n.addResource(lang, 'translation', key, value + encodeMessage(key));
    }
    i18n.changeLanguage(lang);
  }, []);

  useEffect(() => {
    const handler = (lng) => {
      if (tolgee.lang !== lng) {
        tolgee.lang = lng;
      }
    };
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, []);

  useEffect(() => {
    const subscription = tolgee.onLangLoaded.subscribe(updateLanguage);
    return () => subscription.unsubscribe?.();
  }, [updateLanguage]);
  useEffect(() => {
    const subscription = tolgee.onLangChange.subscribe(updateLanguage);
    return () => subscription.unsubscribe?.();
  }, [updateLanguage]);

  // useEffect(() => {
  //   console.log(decodeFromText(tRef.current.innerText));
  // }, [tRef.current?.innerText]);

  return (
    <div className="App">
      <header className="App-header">
        <select
          value={i18n.language}
          onChange={(e) => (tolgee.lang = e.target.value)}
        >
          <option value="en">English</option>
          <option value="cs">Czech</option>
          <option value="de">German</option>
        </select>
        <div ref={tRef} style={{ fontSize: 30 }}>
          <Trans
            t={t}
            i18nKey="hello_world"
            components={{ custom: <b /> }}
            values={{ value }}
          />
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </header>
    </div>
  );
}

export default App;
