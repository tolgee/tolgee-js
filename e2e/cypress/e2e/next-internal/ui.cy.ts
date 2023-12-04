import { login } from '../../common/apiCalls';
import { getByAriaLabel } from '../../common/selectors';
import {
  translateEnglish,
  changeStateEnglish,
  fullPermissions,
} from '../../common/testApiKeys';
import { openUI, visitWithApiKey } from '../../common/nextInternalCommon';
import { getDevUi } from '../../common/devUiTools';
import { simulateReqAndResponse } from '../../common/simulateReqAndResponse';

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

  it('disabled when view only', () => {
    visitWithApiKey(['translations.view', 'screenshots.view']);
    openUI();
    getDevUi().contains('There are no screenshots.').should('be.visible');
    getByAriaLabel('Take screenshot').should('not.exist');
    getDevUi().contains('Update').should('be.disabled');
  });

  it('updates translation properly', () => {
    simulateReqAndResponse({
      permissions: fullPermissions,
      inForm() {
        getDevUi()
          .find('textarea')
          .contains('What To Pack')
          .should('not.be.disabled');
        getDevUi()
          .find('textarea')
          .contains('What To Pack')
          .type('{selectAll}{del}Hello world', { force: true });
      },
      checkRequest(data) {
        assert(data.translations['en'] === 'Hello world');
      },
    });
    cy.contains('Hello world').should('be.visible');
  });

  it('updates translation properly when languages restricted', () => {
    simulateReqAndResponse({
      permissions: translateEnglish,
      inForm() {
        getDevUi()
          .find('textarea')
          .contains('Was mitnehmen')
          .should('be.disabled');
        getDevUi()
          .find('textarea')
          .contains('What To Pack')
          .should('not.be.disabled');
        getDevUi()
          .find('textarea')
          .contains('What To Pack')
          .type('{selectAll}{del}Hello world', { force: true });
      },
      checkRequest(data) {
        assert(data.translations['en'] === 'Hello world');
      },
    });
  });

  it('updates state properly when languages restricted', () => {
    simulateReqAndResponse({
      permissions: changeStateEnglish,
      inForm() {
        getDevUi()
          .findDcyAdvanced({
            value: 'translation-state-button',
            language: 'de',
          })
          .should('be.disabled');
        getDevUi()
          .findDcyAdvanced({
            value: 'translation-state-button',
            language: 'en',
          })
          .should('not.be.disabled');
        getDevUi()
          .findDcyAdvanced({
            value: 'translation-state-button',
            language: 'en',
          })
          .click();
      },
      checkRequest(data) {
        assert(data.states.en === 'REVIEWED', 'State changed correctly');
        assert(
          Object.values(data.states).length === 1,
          'No other states touched'
        );
        assert(
          Object.values(data.translations).length === 0,
          'No translation changes'
        );
      },
    });
  });

  it('updates state properly when languages restricted', () => {
    simulateReqAndResponse({
      permissions: changeStateEnglish,
      inForm() {
        getDevUi()
          .findDcyAdvanced({
            value: 'translation-state-button',
            language: 'de',
          })
          .should('be.disabled');
        getDevUi()
          .findDcyAdvanced({
            value: 'translation-state-button',
            language: 'en',
          })
          .should('not.be.disabled');
        getDevUi()
          .findDcyAdvanced({
            value: 'translation-state-button',
            language: 'en',
          })
          .click();
      },
      checkRequest(data) {
        assert(data.states.en === 'REVIEWED', 'State changed correctly');
        assert(
          Object.values(data.states).length === 1,
          'No other states touched'
        );
        assert(
          Object.values(data.translations).length === 0,
          'No translation changes'
        );
      },
    });
  });
});
