const getElement = (text: string, testId?: string) => {
  return testId
    ? cy.gcy(testId)
    : cy.xpath(`.//*[contains(@class, 'namespaces')]//*[text() = '${text}']`);
};

export const namespacesNgxTest = (
  url: string,
  items: Record<string, { text: string; count: number; testId?: string }[]>
) =>
  describe('translation methods test', () => {
    before(() => {
      cy.visit(url + '/lazy');
    });

    Object.entries(items).forEach(([language, texts]) => {
      // switch to language twice as second run can be different
      // when translations are already in cache
      describe(`for language ${language} (run ${run})`, () => {
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
