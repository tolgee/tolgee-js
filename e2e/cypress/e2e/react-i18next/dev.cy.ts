import { exampleAppTest } from '../../common/exampleAppTest';
import { translationMethodsTest } from '../../common/translationMethodsTest';
import { exampleAppDevTest } from '../../common/exampleAppDevTest';
import { namespacesTest } from '../../common/namespacesTest';

context('React i18next app in dev mode', () => {
  const url = 'http://localhost:8118';
  exampleAppTest(url);
  translationMethodsTest(url, {
    en: [
      { text: 'This is default', count: 1 },
      {
        text: 'This is a key',
        count: 1,
      },
      { text: 'This is key with params value value2', count: 1 },
    ],
    de: [
      { text: 'This is default', count: 1 },
      {
        text: 'Dies ist ein Schlüssel',
        count: 1,
      },
      {
        text: 'Dies ist ein Schlüssel mit den Parametern value value2',
        count: 1,
      },
    ],
  });
  namespacesTest(url, {
    en: [
      { text: 'This is a key in namespace', count: 1 },
      { text: 'This is a key', count: 1 },
    ],
    cs: [
      { text: 'Toto je klíč v namespace', count: 1 },
      { text: 'Toto je klíč', count: 1 },
    ],
  });

  exampleAppDevTest(url);
});
