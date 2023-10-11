export const exampleAppTest = (url: string) =>
  describe('standard example app test', () => {
    before(() => {
      cy.visit(url);
    });

    it('Has title', { retries: 2 }, () => {
      cy.contains('What To Pack').should('be.visible');
    });

    it('Has default items', () => {
      cy.contains('Passport').should('be.visible');
      cy.contains('Maps and directions').should('be.visible');
      cy.contains('Travel guide').should('be.visible');
    });

    it('Has buttons', () => {
      cy.contains('Share').should('be.visible');
      cy.contains('Send via e-mail').should('be.visible');
    });

    it('Deletes item', () => {
      cy.contains('Delete').first().click();
      cy.get('.item__text').should('have.length', 2);
    });

    it('Adds item', () => {
      const newItem = 'Shower gel';
      cy.get('.items__new-item input').type(newItem);
      cy.get('.items__new-item button').click();
      cy.get('.item__text').contains(newItem).should('be.visible');
    });

    it('is translated to german', () => {
      cy.get('.lang-selector').select('de');
      cy.get('body')
        .should('contain', 'Was mitnehmen')
        .should('contain', 'Löschen')
        .should('contain', 'Teilen')
        .should('contain', 'Per Email abschicken')
        .should('contain', 'Übersetzungsmethoden')
        .should('contain', 'Einfügen');

      cy.get('.items__new-item input').should(
        'have.attr',
        'placeholder',
        'Neuer Eintrag'
      );
    });
  });
