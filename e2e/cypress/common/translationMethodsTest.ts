const getElement = (text: string, className?: string) => {
  return className
    ? cy.get(`.${className}`)
    : cy.xpath(`.//*[text() = '${text}']`);
};

export const translationMethodsTest = (
  url: string,
  items: Record<string, { text: string; count: number; className?: string }[]>
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
              getElement(text.text, text.className).should('be.visible');
            });
          });

          texts.forEach((text) => {
            it(`contains "${text.text}" ${text.count} times`, () => {
              getElement(text.text, text.className)
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
