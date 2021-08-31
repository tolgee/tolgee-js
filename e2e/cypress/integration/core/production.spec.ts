context('Production test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8101/production/');
  });

  it('has text with parameter', () => {
    cy.contains('Toto je text s parametrem: value.').should('be.visible');
  });

  it('switches language', () => {
    cy.wait(200);
    cy.get('button').contains('en').click();
    cy.contains('This is test text!').should('be.visible');
  });
});
