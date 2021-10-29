export const translationMethodsTest = (
  url: string,
  items: Record<string, { text: string; count: number }[]>
) =>
  describe('translation methods test', () => {
    before(() => {
      cy.visit(url + '/translation-methods');
    });

    Object.entries(items).forEach(([language, texts]) => {
      describe(`for language ${language}`, () => {
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
