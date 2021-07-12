context('Base test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8101/lang_switching/');
  });

  it('stores current language', () => {
    cy.contains('This is test text!').should('be.visible');
    cy.contains('cs').click();
    cy.contains('Toto je text').should('be.visible');
    cy.reload();
    cy.contains('Toto je text').should('be.visible');
    cy.contains('This is just in english.').should('be.visible');
  });
});
