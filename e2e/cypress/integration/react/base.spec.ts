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

  it('shows default value when provided ', () => {
    cy.contains('This is default').should('be.visible');
  });

  it('shows key as default when default not provided ', () => {
    cy.contains('unknown key').should('be.visible');
  });

  it('opens key context menu when multiple keys are in one element', () => {
    cy.get('.multiple-keys')
      .should('be.visible')
      .should('contain', 'First one')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();

    cy.get('#__tolgee_dev_tools')
      .find('li')
      .should('have.length', 3)
      .should('contain', 'key')
      .should('contain', 'key 2')
      .should('contain', 'key 3');

    cy.get('#__tolgee_dev_tools').find('li').contains('key 2').click();
    cy.get('#__tolgee_dev_tools').should('contain', 'Quick translation');
    cy.get('#__tolgee_dev_tools')
      .find('textarea')
      .should('contain', 'Second one');
  });

  it.only('opens dialog when element contains same key multiple times', () => {
    cy.get('.same-key-multiple')
      .should('be.visible')
      .should('contain', 'First one')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();

    cy.get('#__tolgee_dev_tools').should('contain', 'Quick translation');
    cy.get('#__tolgee_dev_tools')
      .find('textarea')
      .should('contain', 'First one');
  });
});
