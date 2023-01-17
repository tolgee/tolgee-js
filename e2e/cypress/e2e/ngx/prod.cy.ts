import { exampleAppTest } from '../../common/exampleAppTest';
import { translationMethodsTest } from '../../common/translationMethodsTest';

context('Angular app in prod mode', () => {
  const url = 'http://localhost:8115/';

  exampleAppTest(url);
  translationMethodsTest(url, {
    en: [
      { text: 'This is default', count: 3 },
      {
        text: 'This is a key',
        count: 4,
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
});
