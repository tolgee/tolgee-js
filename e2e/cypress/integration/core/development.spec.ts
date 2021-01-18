context('Base test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8101/development/')
    })

    it('will translate with backend', () => {
        cy.xpath("//*[contains(text(), 'English text one.')]")
    })

    it('will highlight', () => {
        cy.get('body').trigger('keydown', {key: "Alt"})
        const element = cy.xpath("//*[contains(text(), 'En')]").trigger("mouseover")
        element.then(e => {
            expect(e.attr("style")).to.contain("background-color");
            expect(e.attr("style")).to.contain("yellow");
        })
        cy.get('body').trigger('keyup', {key: "Alt"})
    });
});