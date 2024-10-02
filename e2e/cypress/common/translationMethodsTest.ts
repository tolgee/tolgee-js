const getElement = (text: string, testId?: string) => {
  return testId ? cy.gcy(testId) : cy.xpath(`.//*[text() = '${text}']`);
};

export const translationMethodsTest = (
  url: string,
  items: Record<string, { text: string; count: number; testId?: string }[]>
) =>
  describe('translation methods test', () => {
    before(() => {
      cy.visit(url);
    });

    // run it twice, as it can behave differently
    // when translations are already cached
    [1, 2].forEach((run) => {
      Object.entries(items).forEach(([language, texts]) => {
        // switch to language twice as second run can be different
        // when translations are already in cache
        describe(`for language ${language} (run ${run})`, () => {
          before(() => {
            cy.get('.tiles').should('be.visible');
            cy.wait(500);
            cy.get('.lang-selector').select(language);
          });

          texts.forEach((text) => {
            it(`contains "${text.text}" ${text.count} times`, () => {
              getElement(text.text, text.testId)
                .should('have.length', text.count)
                .each((el) => {
                  expect(el.text()).equal(text.text);
                });
            });
          });
        });
      });
    });
  });
