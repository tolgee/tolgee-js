const getElement = (text: string, testId?: string) => {
  return testId
    ? cy.gcy(testId)
    : cy.xpath(`.//*[contains(@class, 'namespaces')]//*[text() = '${text}']`);
};

export const namespacesTest = (
  url: string,
  items: Record<string, { text: string; count: number; testId?: string }[]>,
  options?: { skipLoading: boolean }
) =>
  describe('translation methods test', () => {
    before(() => {
      cy.visit(url);
      if (!options?.skipLoading) {
        cy.intercept('GET', '*', (req) => {
          req.on('response', (res) => {
            res.delay = 500;
          });
        });
      }
      cy.contains('Load more', { timeout: 30_000 }).click();
      if (!options?.skipLoading) {
        cy.contains('Loading namespace...').should('exist');
      }
    });

    Object.entries(items).forEach(([language, texts]) => {
      // switch to language twice as second run can be different
      // when translations are already in cache
      describe(`for language ${language}`, () => {
        before(() => {
          cy.get('.lang-selector').select(language);
          cy.get('.namespaces', { timeout: 30_000 }).scrollIntoView();
          Object.values(texts).forEach((text) => {
            getElement(text.text, text.testId).should('be.visible');
          });
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
