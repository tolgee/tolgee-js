context('Base test', () => {
    beforeEach(() => {
        cy.visit('./cypress/testapps/dist/lang_switching/index.html')
    })

    it('stores current language', () => {
        cy.contains("This is test text!").should("be.visible")
        cy.contains("cs").click();
        cy.contains("Toto je text").should("be.visible")
        cy.reload()
        cy.contains("Toto je text").should("be.visible")
    })
});