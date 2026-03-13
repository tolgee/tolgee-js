import { login } from '../../common/apiCalls';
import { fullPermissions } from '../../common/testApiKeys';
import { openUI, visitWithApiKey } from '../../common/nextInternalCommon';
import { getDevUi } from '../../common/devUiTools';
import { simulateReqAndResponse } from '../../common/simulateReqAndResponse';

context('Character limit', () => {
  beforeEach(() => {
    login();
  });

  it('can enable and set character limit', () => {
    simulateReqAndResponse({
      permissions: fullPermissions,
      inForm() {
        getDevUi()
          .findDcy('key-char-limit-checkbox')
          .should('be.visible')
          .click();
        getDevUi()
          .findDcy('key-char-limit-input')
          .should('be.visible')
          .find('input')
          .clear()
          .realType('50');
      },
      checkRequest(data) {
        expect(data.maxCharLimit).to.eq(50);
      },
    });
  });

  it('sends maxCharLimit 0 when enabled with empty value', () => {
    simulateReqAndResponse({
      permissions: fullPermissions,
      inForm() {
        getDevUi()
          .findDcy('key-char-limit-checkbox')
          .should('be.visible')
          .click();
        // leave input empty
      },
      checkRequest(data) {
        expect(data.maxCharLimit).to.eq(0);
      },
    });
  });

  it('hides input when checkbox is unchecked', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    getDevUi().findDcy('key-char-limit-input').should('not.exist');
    getDevUi().findDcy('key-char-limit-checkbox').should('be.visible').click();
    getDevUi().findDcy('key-char-limit-input').should('be.visible');
    getDevUi().findDcy('key-char-limit-checkbox').click();
    getDevUi().findDcy('key-char-limit-input').should('not.exist');
  });

  it('shows character counter when limit is set', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    getDevUi().findDcy('key-char-limit-checkbox').click();
    getDevUi()
      .findDcy('key-char-limit-input')
      .find('input')
      .clear()
      .realType('5');

    // "What To Pack" is 12 chars, limit is 5 — should show counter and warning
    getDevUi().contains('12/5').should('be.visible');
    getDevUi().contains('Limit exceeded by 7 characters').should('be.visible');
  });

  it('disables save button when over limit on new key', () => {
    visitWithApiKey([
      'translations.view',
      'keys.create',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI('2 items');
    getDevUi().findDcy('key-char-limit-checkbox').click();
    getDevUi()
      .findDcy('key-char-limit-input')
      .find('input')
      .clear()
      .realType('2');

    getDevUi()
      .findDcyWithCustom({ value: 'translation-editor', language: 'en' })
      .find('.cm-content')
      .click()
      .clear()
      .realType('This is too long');

    getDevUi().findDcy('key-form-submit').should('be.disabled');
  });

  it('shows confirmation dialog when saving existing key over limit', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    getDevUi().findDcy('key-char-limit-checkbox').click();
    getDevUi()
      .findDcy('key-char-limit-input')
      .find('input')
      .clear()
      .realType('5');

    // wait for char limit to be applied — counter should appear
    getDevUi().contains('12/5').should('be.visible');
    // existing key with over-limit translation — save should show confirmation
    getDevUi().findDcy('key-form-submit').should('not.be.disabled');
    getDevUi().findDcy('key-form-submit').click();
    getDevUi().findDcy('char-limit-confirmation-cancel').should('be.visible');
    getDevUi().findDcy('char-limit-confirmation-save').should('be.visible');
  });

  it('can cancel confirmation dialog', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    getDevUi().findDcy('key-char-limit-checkbox').click();
    getDevUi()
      .findDcy('key-char-limit-input')
      .find('input')
      .clear()
      .realType('5');

    getDevUi().contains('12/5').should('be.visible');
    getDevUi().findDcy('key-form-submit').click();
    getDevUi().findDcy('char-limit-confirmation-cancel').click();
    // dialog should close, form still visible
    getDevUi().findDcy('char-limit-confirmation-cancel').should('not.exist');
    getDevUi().findDcy('key-form-submit').should('be.visible');
  });

  it('can confirm save despite over limit', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();

    cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, (req) => {
      req.reply({ body: { response: 'success' } });
    }).as('updateKey');

    getDevUi().findDcy('key-char-limit-checkbox').click();
    getDevUi()
      .findDcy('key-char-limit-input')
      .find('input')
      .clear()
      .realType('5');

    getDevUi().contains('12/5').should('be.visible');
    getDevUi().findDcy('key-form-submit').click();
    getDevUi().findDcy('char-limit-confirmation-save').click();

    cy.wait('@updateKey').then(({ request }) => {
      expect(request.body.maxCharLimit).to.eq(5);
    });
  });

  it('is not visible without keys.edit permission', () => {
    visitWithApiKey(['translations.view', 'translations.edit']);
    openUI();
    getDevUi().findDcy('key-char-limit-checkbox').should('not.exist');
  });
});
