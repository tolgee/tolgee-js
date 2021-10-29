export const exampleAppDevTest = (url: string) =>
  describe('standard example app dev test', () => {
    beforeEach(() => {
      cy.visit(url);
    });

    it('Shows loading on visit', () => {
      cy.contains('Loading...').should('be.visible');
      cy.contains('On the road').should('be.visible');
    });

    it('title can be translated', () => {
      cy.contains('On the road').trigger('keydown', { key: 'Alt' }).click();
      cy.contains('Quick translation').should('be.visible');
    });

    it('placeholder can be translated', () => {
      cy.get('input').trigger('keydown', { key: 'Alt' }).click();
      cy.contains('Quick translation').should('be.visible');
    });
  });
