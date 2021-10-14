context('Next Production', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8107');
  });

  it('Is translated in english', () => {
    cy.contains('Hello world!');
  });

  it('it switches language', () => {
    cy.contains('Hello world!').should('be.visible');
    cy.contains('de').click();
    cy.contains('Hallo Welt!');
    cy.contains('en').click();
    cy.contains('Hello world!');
  });
});
