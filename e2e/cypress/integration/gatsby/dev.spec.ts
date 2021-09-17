context('Gatsby development', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8104/');
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

  it('it opens UI', () => {
    cy.contains('Hello world!')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();
    cy.contains('Translate text');
    cy.contains('Update');
  });
});
