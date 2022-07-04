import { login } from '../../common/apiCalls';
import { getByAriaLabel } from '../../common/selectors';
import testApiKey from '../../common/testApiKey';
import testLanguages from '../../common/testLanguages';
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

  it('it opens UI', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
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
    assertCanEditEnglish();
  });

  it('updates translation properly when languages restricted', () => {
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
    assertCanEditEnglish();
  });

  it('disabled when view only', () => {
    visitWithApiKey(['translations.view', 'screenshots.view']);
    openUI();
    cy.contains('There are no screenshots.').should('be.visible');
    getByAriaLabel('Take screenshot').should('not.exist');
    cy.contains('Update').should('be.disabled');
  });

  function assertCanEditEnglish() {
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
  }
});
