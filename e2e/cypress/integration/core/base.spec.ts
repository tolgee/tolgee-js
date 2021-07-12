context('Base test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8101/base/');
  });

  it('is working for all bundles', () => {
    const xpath = cy.xpath("//*[contains(text(), 'This is test text!')]");
    xpath.should('have.length', 6);
  });
});
