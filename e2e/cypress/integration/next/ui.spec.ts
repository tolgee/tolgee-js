import {
  login,
  createApiKey,
  getScreenshots,
  deleteScreenshots,
} from '../../common/apiCalls';
import { getByAriaLabel } from '../../common/selectors';
import { Scope } from '../../common/types';

context('UI Dialog', () => {
  beforeEach(() => {
    login().then(() => {
      removeScreenshots();
    });
  });

  afterEach(() => {
    removeScreenshots();
  });

  it('it opens UI', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    cy.contains('Hello world!')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();
    cy.contains('Quick translation');
    cy.contains('Update');
  });

  it('make screenshot', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    cy.contains('Hello world!')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();
    cy.get('*[aria-label="Take screenshot"]').should('be.visible').click();
    cy.get('*[aria-label="Screenshot"]').should('be.visible');
  });

  it('disabled when view only', () => {
    visitWithApiKey(['translations.view', 'screenshots.view']);
    openUI();
    cy.contains('There are no screenshots.').should('be.visible');
    getByAriaLabel('Take screenshot').should('not.exist');
    cy.contains('Update').should('be.disabled');
  });

  it('screenshots not visible', () => {
    visitWithApiKey(['translations.view', 'keys.edit', 'translations.edit']);
    openUI();
    cy.contains('There are no screenshots.').should('not.exist');
    getByAriaLabel('Take screenshot').should('not.exist');
    cy.contains('Update').should('not.be.disabled');
  });

  it('screenshots not editable', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
    ]);
    openUI();
    cy.contains('There are no screenshots.').should('be.visible');
    getByAriaLabel('Take screenshot').should('not.exist');
  });

  it('screenshots editable', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    cy.contains('There are no screenshots.').should('be.visible');
    getByAriaLabel('Take screenshot').should('be.visible').click();
    getByAriaLabel('Screenshot').should('be.visible').trigger('mouseover');
    // we should be able to delete just uploaded images
    getByAriaLabel('Delete').should('be.visible');

    cy.contains('Update').click();

    openUI();
    getByAriaLabel('Screenshot').should('be.visible').trigger('mouseover');
    // we can't delete already saved screenshots
    getByAriaLabel('Delete').should('not.exist');
  });

  it('screenshots deletable', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
      'screenshots.delete',
    ]);
    openUI();
    getByAriaLabel('Take screenshot').should('be.visible').click();
    getByAriaLabel('Screenshot').should('be.visible');
    cy.contains('Update').click();

    openUI();
    getByAriaLabel('Screenshot').trigger('mouseover');
    getByAriaLabel('Delete').should('be.visible').click();
    cy.contains('Update').click();

    openUI();
    getByAriaLabel('Screenshot').should('not.exist');
  });

  const openUI = (translation = 'Hello world!') => {
    cy.contains(translation)
      .should('be.visible')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();
    cy.get('textarea').contains(translation).should('be.visible');
    cy.wait(300);
  };

  const removeScreenshots = () => {
    getScreenshots(1, 1000000201).then((data) => {
      const screenshotIds = data._embedded?.screenshots.map((sc) => sc.id);
      if (screenshotIds) {
        return deleteScreenshots(1, 1000000201, screenshotIds);
      }
    });
  };

  const visitWithApiKey = (scopes: Scope[]) => {
    createApiKey({ projectId: 1, scopes }).then((data) => {
      cy.visit(`http://localhost:8114/?api_key=${data.key}`);
    });
  };
});
