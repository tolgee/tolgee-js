context('Base test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8108/');
  });

  it('it translates', () => {
    cy.contains('Hello world!');
  });

  it('it switches language', () => {
    cy.get('select').select('de');
    cy.contains('Hallo Welt!');
  });

  it('shows default value when provided ', () => {
    cy.contains('This is default').should('be.visible');
  });

  it('shows key as default when default not provided ', () => {
    cy.contains('unknown key').should('be.visible');
  });
});
