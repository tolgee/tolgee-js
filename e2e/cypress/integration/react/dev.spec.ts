import { exampleAppTest } from '../../common/exampleAppTest';
import { translationMethodsTest } from '../../common/translationMethodsTest';
import { exampleAppDevTest } from '../../common/exampleAppDevTest';

context('React app in dev mode', () => {
  const url = 'http://localhost:8113';
  exampleAppTest(url);
  translationMethodsTest(url, {
    en: [
      { text: 'This is default', count: 2 },
      {
        text: 'This is a key',
        count: 5,
      },
      { text: 'This is key with params value value2', count: 4 },
      {
        text: 'This is a key with tags bold value',
        count: 2,
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
        count: 4,
      },
      {
        text: 'Dies ist ein Schlüssel mit den Tags bold value',
        count: 2,
        testId: 'translationWithTags',
      },
    ],
  });

  exampleAppDevTest(url);

  describe('translation in translation', () => {
    beforeEach(() => {
      cy.visit(url + '/translation-methods');
    });

    it('opens inner translation correctly', () => {
      cy.gcy('translationInner').trigger('keydown', { key: 'Alt' }).click();
      cy.contains('translation_inner').should('be.visible');
    });

    it('opens outer translation correctly', () => {
      cy.gcy('translationOuter').trigger('keydown', { key: 'Alt' }).click();
      cy.contains('translation_outer').should('be.visible');
    });
  });
});
