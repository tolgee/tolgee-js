context('Base test', () => {
    beforeEach(() => {
        cy.visit('./cypress/testapps/dist/base/index.html')
    })

    it('is working for all bundles', () => {
        const xpath = cy.xpath("//*[contains(text(), 'This is test text!')]");
        xpath.should('have.length', 6);
    })
});