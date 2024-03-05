import { login } from '../../common/apiCalls';
import { fullPermissions } from '../../common/testApiKeys';
import { openUI, visitWithApiKey } from '../../common/nextInternalCommon';
import { getDevUi } from '../../common/devUiTools';
import { simulateReqAndResponse } from '../../common/simulateReqAndResponse';

context('UI with plurals', () => {
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
    getDevUi().findDcy('key-plural-checkbox').should('be.visible').click();
    checkPluralValue('en', 'one', '');
    checkPluralValue('en', 'other', 'What To Pack');
    checkPluralValue('de', 'one', '');
    checkPluralValue('de', 'other', 'Was mitnehmen');
  });

  it('updates translation properly', () => {
    simulateReqAndResponse({
      permissions: fullPermissions,
      inForm() {
        getDevUi().findDcy('key-plural-checkbox').should('be.visible').click();
        getDevUi().findDcy('key-plural-checkbox-expand').click();
        getDevUi()
          .findDcy('key-plural-variable-name')
          .find('input')
          .clear()
          .type('testValue', { force: true });
      },
      checkRequest(data) {
        assert(
          data.translations['en'] ===
            '{testValue, plural, other {What To Pack}}'
        );
        assert(
          data.translations['de'] ===
            '{testValue, plural, other {Was mitnehmen}}'
        );
        assert(data.isPlural === true);
        assert(data.pluralArgName === 'testValue');
      },
    });
  });

  it('keeps translation empty if no plural is filled', () => {
    simulateReqAndResponse({
      permissions: fullPermissions,
      inForm() {
        getDevUi().findDcy('key-plural-checkbox').should('be.visible').click();
        setPluralValue('en', 'one', '# item');
        setPluralValue('en', 'other', '# items');
        setPluralValue('de', 'other', '');
      },
      checkRequest(data) {
        expect(data.translations['en']).equal(
          '{value, plural, other {# items} one {# item}}'
        );
        assert(
          Object.values(data.translations).filter(Boolean).length === 1,
          'No other states touched'
        );
        assert(data.isPlural === true);
        assert(data.pluralArgName === 'value');
      },
    });
  });

  function checkPluralValue(language: string, variant: string, text: string) {
    getDevUi()
      .findDcyWithCustom({
        value: 'translation-field',
        language,
      })
      .findDcyWithCustom({ value: 'translation-editor', variant })
      .should('have.text', text);
  }

  function setPluralValue(language: string, variant: string, text: string) {
    const item = getDevUi()
      .findDcyWithCustom({
        value: 'translation-field',
        language,
      })
      .findDcyWithCustom({ value: 'translation-editor', variant })
      .find('.cm-content')
      .click()
      .clear();

    if (text) {
      item.type(text);
    }
  }
});
