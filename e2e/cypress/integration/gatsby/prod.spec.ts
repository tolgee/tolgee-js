context('Gatsby Production', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8105/');
  });

  it('Is translated in english', () => {
    cy.contains('Hello world!');
  });

  it('it switches language', () => {
    cy.contains('DE').click();
    cy.contains('Hallo Welt!');
    cy.contains('EN').click();
    cy.contains('Hello world!');
  });
});
