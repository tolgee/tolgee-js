import { login } from '../../common/apiCalls';
import { getByAriaLabel } from '../../common/selectors';
import { openUI, visitWithApiKey } from '../../common/nextInternalCommon';
import { getDevUi } from '../../common/devUiTools';

/**
 * Chrome 137 has broken the extension support of cypress
 * https://github.com/cypress-io/cypress/issues/31690
 *
 * As there is no immediate alternative, I'm skipping these tests for now
 * Hopefully alternative appears
 */

context('UI Dialog', () => {
  beforeEach(() => {
    login();
  });

  it.skip('makes screenshot', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    getDevUi()
      .find('*[aria-label="Take screenshot"]')
      .should('be.visible')
      .click();
    getDevUi().find('*[aria-label="Screenshot"]').should('be.visible');
  });

  it('screenshots not editable', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
    ]);
    openUI();
    getDevUi().contains('There are no screenshots.').should('be.visible');
    getByAriaLabel('Take screenshot').should('not.exist');
  });

  it.skip('screenshots editable', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    getDevUi().contains('There are no screenshots.').should('be.visible');
    getByAriaLabel('Take screenshot').should('be.visible').click();
    getByAriaLabel('Screenshot').should('be.visible').trigger('mouseover');
    // we should be able to delete just uploaded images
    getByAriaLabel('Delete').should('be.visible');

    getDevUi().contains('Update').click();

    openUI();
    getByAriaLabel('Screenshot').should('be.visible').trigger('mouseover');
    // we can't delete already saved screenshots
    getByAriaLabel('Delete').should('not.exist');
  });

  it.skip('screenshots deletable', () => {
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
    getDevUi().contains('Update').click();

    openUI();
    getByAriaLabel('Screenshot').trigger('mouseover');
    getByAriaLabel('Delete').should('be.visible').click();
    getDevUi().contains('Update').click();

    openUI();
    getByAriaLabel('Screenshot').should('not.exist');
  });
});
