import { exampleAppTest } from '../../common/exampleAppTest';
import { namespacesTest } from '../../common/namespacesTest';
import { translationMethodsTest } from '../../common/translationMethodsTest';

context('React i18next app in prod mode', () => {
  const url = 'http://localhost:8117';
  const translationMethods = url + '/translation-methods';
  exampleAppTest(url);
  translationMethodsTest(translationMethods, {
    en: [
      { text: 'This is default', count: 1 },
      {
        text: 'This is a key',
        count: 2,
      },
      { text: 'This is key with params value value2', count: 1 },
    ],
    de: [
      { text: 'This is default', count: 1 },
      {
        text: 'Dies ist ein Schlüssel',
        count: 2,
      },
      {
        text: 'Dies ist ein Schlüssel mit den Parametern value value2',
        count: 1,
      },
    ],
  });
  namespacesTest(translationMethods, {
    en: [
      { text: 'This is a key in namespace', count: 1 },
      { text: 'This is a key', count: 1 },
    ],
    cs: [
      { text: 'Toto je klíč v namespace', count: 1 },
      { text: 'Toto je klíč', count: 1 },
    ],
  });
});
