import { login } from '../../common/apiCalls';
import { getByAriaLabel } from '../../common/selectors';
import {
  translateEnglish,
  fullPermissions,
  changeStateEnglish,
} from '../../common/testApiKeys';
import {
  getEditor,
  openUI,
  visitWithApiKey,
} from '../../common/nextInternalCommon';
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
    getDevUi().contains('Update').should('not.have.attr', 'contenteditable');
  });

  it('updates translation properly', () => {
    simulateReqAndResponse({
      permissions: fullPermissions,
      inForm() {
        getEditor()
          .contains('What To Pack')
          .closestDcy('global-editor')
          .should('not.have.attr', 'disabled');
        getEditor()
          .contains('What To Pack')
          .parent()
          .click()
          .realType('{backspace}'.repeat(20) + 'Hello world');
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
        getEditor()
          .contains('Was mitnehmen')
          .closestDcy('global-editor')
          .should('have.attr', 'disabled');
        getEditor()
          .contains('What To Pack')
          .closestDcy('global-editor')
          .should('not.have.attr', 'disabled');
        getEditor()
          .contains('What To Pack')
          .parent()
          .click()
          .clear()
          .realType('{backspace}'.repeat(20) + 'Hello world');
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
          .findDcyWithCustom({
            value: 'translation-state-button',
            language: 'de',
          })
          .should('not.exist');
        getDevUi()
          .findDcyWithCustom({
            value: 'translation-state-button',
            language: 'en',
          })
          .should('not.be.disabled')
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

  it('updates translation to empty value correctly', () => {
    simulateReqAndResponse({
      language: 'Česky',
      translation: 'Co sbalit',
      permissions: fullPermissions,
      selectedLanguages: ['en', 'cs'],
      inForm() {
        getDevUi()
          .findDcy('global-editor')
          .eq(1)
          .click()
          .realType('{backspace}'.repeat(20));
      },
      checkPage() {
        cy.contains('app-title');
      },
    });
  });
});
