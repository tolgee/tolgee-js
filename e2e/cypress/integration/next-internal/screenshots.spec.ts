import { login } from '../../common/apiCalls';
import { getByAriaLabel } from '../../common/selectors';
import {
  openUI,
  removeScreenshots,
  visitWithApiKey,
} from '../../common/nextInternalCommon';

context('UI Dialog', () => {
  beforeEach(() => {
    login().then(() => {
      removeScreenshots();
    });
  });

  afterEach(() => {
    removeScreenshots();
  });

  it('makes screenshot', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    cy.get('*[aria-label="Take screenshot"]').should('be.visible').click();
    cy.get('*[aria-label="Screenshot"]').should('be.visible');
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
});
