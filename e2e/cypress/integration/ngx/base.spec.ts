context('Base test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8103/');
  });

  it('it translates', () => {
    cy.contains('This is standard text somewhere in DOM.');
  });

  it('it switches language', () => {
    cy.xpath("//button[text() = 'de']").click();
    cy.contains('Das ist Standardtext irgendwo im DOM.');
  });
});
