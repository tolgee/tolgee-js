import { exampleAppTest } from '../../common/exampleAppTest';
import { translationMethodsTest } from '../../common/translationMethodsTest';

context('Next with app router in prod mode', () => {
  const url = 'http://localhost:8127';
  const translationMethods = url + '/translation-methods';
  exampleAppTest(url);
  translationMethodsTest(translationMethods, {
    en: [
      { text: 'This is a key', count: 2 },
      { text: 'This is key with params value value2', count: 6 },
      {
        text: 'This is a key with tags bold value',
        count: 2,
        testId: 'translationWithTags',
      },
      { text: 'Translation in translation', count: 2 },
    ],
    de: [
      { text: 'Dies ist ein Schlüssel', count: 2 },
      {
        text: 'Dies ist ein Schlüssel mit den Parametern value value2',
        count: 6,
      },
      {
        text: 'Dies ist ein Schlüssel mit den Tags bold value',
        count: 2,
        testId: 'translationWithTags',
      },
      { text: 'Translation in translation', count: 2 },
    ],
  });
});
