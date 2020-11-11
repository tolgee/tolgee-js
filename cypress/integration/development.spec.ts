context('Base test', () => {
    beforeEach(() => {
        cy.visit('./cypress/testapps/dist/development/index.html')
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

    it('will highlight select', () => {
        cy.get('body').trigger('keydown', {key: "Alt"})
        const element = cy.get('select').trigger("mouseover");
        element.then(e => {
            expect(e.attr("style")).to.contain("background-color");
            expect(e.attr("style")).to.contain("yellow");
        });
        cy.get('body').trigger('keyup', {key: "Alt"})
    })
});