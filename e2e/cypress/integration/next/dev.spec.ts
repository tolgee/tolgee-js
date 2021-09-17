context('Next development', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8106/');
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

  it('it opens UI', () => {
    cy.contains('Hello world!')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();
    cy.contains('Translate text');
    cy.contains('Update');
  });

  it('make screenshot', () => {
    cy.contains('Hello world!')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();
    cy.contains('Take screenshot').should('be.visible').click();
    cy.contains('Captured screenshot').should('be.visible');
    cy.contains('Upload').click();
    cy.contains('Translate text').should('be.visible');
  });
});
