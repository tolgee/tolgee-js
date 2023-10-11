import { login } from '../../common/apiCalls';
import { getByAriaLabel } from '../../common/selectors';
import testApiKey from '../../common/testApiKey';
import testLanguages from '../../common/testLanguages';
import { openUI, visitWithApiKey } from '../../common/nextInternalCommon';
import { getDevUi } from '../../common/devUiTools';

context('UI Dialog', () => {
  beforeEach(() => {
    login();
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
    getDevUi().contains('Quick translation');
    getDevUi().contains('Update');
    getDevUi()
      .find('#_tolgee_platform_link')
      .invoke('attr', 'href')
      .should('contain', '/projects/1/translations/single?key=app-title');
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
    cy.intercept(
      { path: '/v2/projects/*/languages**', method: 'get' },
      (req) => {
        req.reply(testLanguages);
      }
    );
    visitWithApiKey([
      'translations.view',
      'translations.edit',
      'screenshots.view',
    ]);
    openUI();
    getDevUi().find('textarea').contains('Was mitnehmen').should('be.disabled');
    assertCanEditEnglish();
  });

  it('disabled when view only', () => {
    visitWithApiKey(['translations.view', 'screenshots.view']);
    openUI();
    getDevUi().contains('There are no screenshots.').should('be.visible');
    getByAriaLabel('Take screenshot').should('not.exist');
    getDevUi().contains('Update').should('be.disabled');
  });

  function assertCanEditEnglish() {
    getDevUi()
      .find('textarea')
      .contains('What To Pack')
      .should('not.be.disabled');
    getDevUi()
      .find('textarea')
      .contains('What To Pack')
      .type('{selectAll}{del}Hello world', { force: true });
    cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, (req) => {
      req.reply({
        body: {
          id: 1000000706,
          name: 'app-title',
          translations: {
            de: { id: 1000000806, text: 'Was mitnehmen', state: 'TRANSLATED' },
            en: { id: 1000000817, text: 'Hello world', state: 'TRANSLATED' },
            fr: { id: 1000000828, text: 'Quoi emballer', state: 'TRANSLATED' },
            cs: { id: 1000000839, text: 'Co sbalit', state: 'TRANSLATED' },
          },
          tags: [],
          screenshots: [],
        },
      });
    }).as('updateTranslation');
    getDevUi().contains('Update').click();
    cy.wait('@updateTranslation');
    getDevUi().contains('Hello world').should('be.visible');
  }
});
