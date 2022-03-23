import {
  login,
  createApiKey,
  getScreenshots,
  deleteScreenshots,
} from '../../common/apiCalls';
import { getByAriaLabel } from '../../common/selectors';
import { Scope } from '../../common/types';
import testApiKey from './testApiKey';
import testLanguages from './testLanguages';

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
    cy.contains('On the road')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();
    cy.contains('Quick translation');
    cy.contains('Update');
    cy.get('#_tolgee_platform_link')
      .invoke('attr', 'href')
      .should(
        'contain',
        '/projects/1/translations/single?key=on-the-road-title'
      );
  });

  it('updates translation properly', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
      'screenshots.delete',
    ]);
    openUI();
    cy.get('textarea').contains('On the road').click();
    cy.focused().clear().type('Hello world');
    cy.intercept({ path: '/v2/projects/keys/**', method: 'put' }, (req) => {
      req.reply({
        body: {
          id: 1000000706,
          name: 'on-the-road-title',
          translations: {
            de: { id: 1000000806, text: 'Auf dem Weg', state: 'TRANSLATED' },
            en: { id: 1000000817, text: 'Hello world', state: 'TRANSLATED' },
            fr: { id: 1000000828, text: 'Sur la route', state: 'TRANSLATED' },
            cs: { id: 1000000839, text: 'Na cestu', state: 'TRANSLATED' },
          },
          tags: [],
          screenshots: [],
        },
      });
    }).as('updateTranslation');
    cy.contains('Update').click();
    cy.wait('@updateTranslation');
    cy.contains('Hello world').should('be.visible');
  });

  it.only('updates translation properly when languages restricted', () => {
    // simulating restricted languages in api key info (english only)
    cy.intercept({ path: '/v2/api-keys/current**', method: 'get' }, (req) => {
      req.reply(testApiKey);
    });
    cy.intercept({ path: '/v2/projects/languages**', method: 'get' }, (req) => {
      req.reply(testLanguages);
    });
    visitWithApiKey([
      'translations.view',
      'translations.edit',
      'screenshots.view',
    ]);
    openUI();
    cy.get('textarea').contains('Auf dem Weg').should('be.disabled');
    cy.get('textarea').contains('On the road').click();
    cy.focused().clear().type('Hello world');
    cy.intercept({ path: '/v2/projects/keys/**', method: 'put' }, (req) => {
      req.reply({
        body: {
          id: 1000000706,
          name: 'on-the-road-title',
          translations: {
            de: { id: 1000000806, text: 'Auf dem Weg', state: 'TRANSLATED' },
            en: { id: 1000000817, text: 'Hello world', state: 'TRANSLATED' },
            fr: { id: 1000000828, text: 'Sur la route', state: 'TRANSLATED' },
            cs: { id: 1000000839, text: 'Na cestu', state: 'TRANSLATED' },
          },
          tags: [],
          screenshots: [],
        },
      });
    }).as('updateTranslation');
    cy.contains('Update').click();
    cy.wait('@updateTranslation');
    cy.contains('Hello world').should('be.visible');
  });

  it('make screenshot', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    cy.contains('On the road')
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

  const openUI = (translation = 'On the road') => {
    cy.contains(translation)
      .should('be.visible')
      .trigger('keydown', { key: 'Alt' })
      .trigger('mouseover')
      .click();
    cy.get('textarea').contains(translation).should('be.visible');
    cy.wait(300);
  };

  const removeScreenshots = () => {
    getScreenshots(1, 1000000706).then((data) => {
      const screenshotIds = data._embedded?.screenshots.map((sc) => sc.id);
      if (screenshotIds) {
        return deleteScreenshots(1, 1000000706, screenshotIds);
      }
    });
  };

  const visitWithApiKey = (scopes: Scope[]) => {
    createApiKey({ projectId: 1, scopes })
      .then((data) => {
        cy.visit(`http://localhost:8114/?api_key=${data.key}`);
      })
      .then(() =>
        localStorage.setItem('__tolgee_preferredLanguages', '["en","de"]')
      );
    cy.contains('On the road').invoke('attr', '_tolgee').should('exist');
  };
});
