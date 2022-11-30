import { exampleAppTest } from '../../common/exampleAppTest';
import { translationMethodsTest } from '../../common/translationMethodsTest';
import { exampleAppDevTest } from '../../common/exampleAppDevTest';
import { namespacesNgxTest } from '../../common/namespacesNgxTest';

context('Angular app in dev mode', () => {
  const url = 'http://localhost:8116/';
  exampleAppTest(url);
  translationMethodsTest(url, {
    en: [
      { text: 'This is default', count: 3 },
      {
        text: 'This is a key',
        count: 4,
      },
      {
        text: 'This is a key in namespace',
        count: 1,
      },
      { text: 'This is key with params value value2', count: 2 },
    ],
    de: [
      { text: 'This is default', count: 3 },
      {
        text: 'Dies ist ein Schlüssel',
        count: 4,
      },
      {
        text: 'Dies ist ein Schlüssel mit den Parametern value value2',
        count: 2,
      },
    ],
  });

  namespacesNgxTest(url, {
    en: [{ text: 'This is a key in namespace', count: 1 }],
  });

  exampleAppDevTest(url);
});
