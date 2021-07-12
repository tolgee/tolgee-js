context('Base test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8102/');
  });

  it('it translates', () => {
    cy.contains('Hello world!');
  });

  it('it switches language', () => {
    cy.get('select').select('de');
    cy.contains('Hallo Welt!');
  });
});
