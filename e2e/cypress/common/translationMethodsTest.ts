export const translationMethodsTest = (
  url: string,
  items: Record<string, { text: string; count: number }[]>
) =>
  describe('translation methods test', () => {
    before(() => {
      cy.visit(url + '/translation-methods');
    });

    // run it twice, as it can behave differently
    // when translations are already cached
    [1, 2].forEach((run) => {
      Object.entries(items).forEach(([language, texts]) => {
        // switch to language twice as second run can be different
        // when translations are already in cache
        describe(`for language ${language} (run ${run})`, () => {
          before(() => {
            cy.get('.lang-selector').select(language);
            Object.values(texts).forEach((text) => {
              cy.contains(text.text).should('be.visible');
            });
          });

          texts.forEach((text) => {
            it(`contains "${text.text}" ${text.count} times`, () => {
              cy.xpath(`.//*[text() = '${text.text}']`).should(
                'have.length',
                text.count
              );
            });
          });
        });
      });
    });
  });
