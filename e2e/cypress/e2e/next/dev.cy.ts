import { exampleAppTest } from '../../common/exampleAppTest';
import { translationMethodsTest } from '../../common/translationMethodsTest';
import { exampleAppDevTest } from '../../common/exampleAppDevTest';
import { namespacesTest } from '../../common/namespacesTest';

context('React app in dev mode', () => {
  const url = 'http://localhost:8106';
  exampleAppTest(url);
  translationMethodsTest(url, {
    en: [
      { text: 'This is default', count: 2 },
      {
        text: 'This is a key',
        count: 5,
      },
      { text: 'This is key with params value value2', count: 3 },
      {
        text: 'This is a key with tags bold value',
        count: 1,
        testId: 'translationWithTags',
      },
    ],
    de: [
      { text: 'This is default', count: 2 },
      {
        text: 'Dies ist ein Schlüssel',
        count: 5,
      },
      {
        text: 'Dies ist ein Schlüssel mit den Parametern value value2',
        count: 3,
      },
      {
        text: 'Dies ist ein Schlüssel mit den Tags bold value',
        count: 1,
        testId: 'translationWithTags',
      },
    ],
  });

  namespacesTest(
    url,
    {
      en: [
        { text: 'This is a key in namespace', count: 2 },
        { text: 'This is a key', count: 1 },
      ],
      cs: [
        { text: 'Toto je klíč v namespace', count: 2 },
        { text: 'Toto je klíč', count: 1 },
      ],
    },
    { skipLoading: true }
  );

  exampleAppDevTest(url, { noLoading: true });
});
