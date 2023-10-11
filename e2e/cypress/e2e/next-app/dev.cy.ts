import { exampleAppTest } from '../../common/exampleAppTest';
import { translationMethodsTest } from '../../common/translationMethodsTest';
import { exampleAppDevTest } from '../../common/exampleAppDevTest';

context('Next with app router in dev mode', { retries: 5 }, () => {
  const url = 'http://localhost:8122';
  exampleAppTest(url);
  translationMethodsTest(url, {
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

  exampleAppDevTest(url, { noLoading: true });
});
