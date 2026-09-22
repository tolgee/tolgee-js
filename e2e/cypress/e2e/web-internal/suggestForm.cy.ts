import { login } from '../../common/apiCalls';
import { getDevUi } from '../../common/devUiTools';
import { openUI, visitWithApiKey } from '../../common/nextInternalCommon';
import {
  ApiKeyPermissionsModel,
  mockPermissions,
} from '../../common/simulateReqAndResponse';
import {
  suggestOnly,
  translateEnglishSuggestRest,
  suggestGermanKeyOfEditor,
  viewOnlyKeyOfEditor,
} from '../../common/testApiKeys';

const EN_ID = 1000000001;
const DE_ID = 1000000000;
const CS_ID = 1000000003;

const SUGGESTION_URL = '/v2/projects/*/languages/*/key/*/suggestion';

function openDialogAs(
  permissions: ApiKeyPermissionsModel,
  languages?: string[]
) {
  mockPermissions(permissions);
  visitWithApiKey(['translations.view', 'screenshots.view'], languages);
  openUI();
}

function retype(language: string, text: string) {
  getDevUi()
    .findDcyWithCustom({ value: 'translation-field', language })
    .find('.cm-content')
    .click()
    .realType('{backspace}'.repeat(20) + text);
}

context('Suggesting from the dialog', () => {
  beforeEach(() => {
    login();
  });

  it('gives a suggest-only user a working form instead of a disabled one', () => {
    openDialogAs(suggestOnly);

    getDevUi().findDcy('error-alert').should('not.exist');
    getDevUi().findDcy('tag-autocomplete-input').should('not.exist');
    getDevUi()
      .findDcy('translation-field-suggest-note')
      .should('have.length', 2);
    getDevUi()
      .findDcy('key-form-submit')
      .should('have.text', 'Suggest')
      .and('be.disabled');

    cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, () => {
      throw new Error('a suggest-only user must not update the key');
    });
    cy.intercept({ path: SUGGESTION_URL, method: 'post' }, (req) =>
      req.reply({})
    ).as('suggest');

    retype('en', 'Hello world');
    getDevUi().findDcy('key-form-submit').should('not.be.disabled').click();

    cy.wait('@suggest').then(({ request }) => {
      expect(request.url).to.contain(`/languages/${EN_ID}/key/`);
      expect(request.body).to.deep.eq({ translation: 'Hello world' });
    });
    getDevUi().findDcy('key-form-submit').should('not.exist');
  });

  it('saves what it may and suggests the rest in one click', () => {
    openDialogAs(translateEnglishSuggestRest);

    getDevUi()
      .findDcyWithCustom({
        value: 'translation-field-suggest-note',
        language: 'en',
      })
      .should('not.exist');
    getDevUi()
      .findDcyWithCustom({
        value: 'translation-field-suggest-note',
        language: 'de',
      })
      .should('be.visible');
    getDevUi().findDcy('key-form-submit').should('have.text', 'Save');

    retype('en', 'Hello world');
    getDevUi().findDcy('key-form-submit').should('have.text', 'Save');
    retype('de', 'Hallo Welt');
    getDevUi().findDcy('key-form-submit').should('have.text', 'Save & suggest');

    cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, (req) =>
      req.reply({})
    ).as('update');
    cy.intercept({ path: SUGGESTION_URL, method: 'post' }, (req) =>
      req.reply({})
    ).as('suggest');

    getDevUi().findDcy('key-form-submit').click();

    cy.wait('@update').then(({ request }) => {
      expect(request.body.translations).to.deep.eq({ en: 'Hello world' });
    });
    cy.wait('@suggest').then(({ request }) => {
      expect(request.url).to.contain(`/languages/${DE_ID}/key/`);
      expect(request.body).to.deep.eq({ translation: 'Hallo Welt' });
    });
    getDevUi().findDcy('key-form-submit').should('not.exist');
  });

  it('keeps the dialog open with the error on the field when one suggestion fails', () => {
    openDialogAs(translateEnglishSuggestRest, ['en', 'de', 'cs']);

    retype('en', 'Hello world');
    retype('de', 'Hallo Welt');
    retype('cs', 'Ahoj svete');

    cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, (req) =>
      req.reply({})
    ).as('update');
    cy.intercept({ path: SUGGESTION_URL, method: 'post' }, (req) =>
      req.url.includes(`/languages/${CS_ID}/`)
        ? req.reply({})
        : req.reply({ statusCode: 400, body: { code: 'duplicate_suggestion' } })
    ).as('suggest');

    getDevUi().findDcy('key-form-submit').click();
    cy.wait(['@update', '@suggest', '@suggest']);

    getDevUi()
      .findDcyWithCustom({ value: 'translation-field-error', language: 'de' })
      .should('be.visible')
      .findDcyWithCustom({
        value: 'error-alert',
        'error-code': 'duplicate_suggestion',
      })
      .should('be.visible');
    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language: 'de' })
      .should('contain.text', 'Hallo Welt');
    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language: 'cs' })
      .should('not.contain.text', 'Ahoj svete');

    retype('de', 'Hallo');
    getDevUi().findDcy('translation-field-error').should('not.exist');
  });

  it('tells an editor whose API key is view-only that the key is the limit', () => {
    // not openDialogAs: openUI asserts an enabled editor, and this form is disabled by design
    mockPermissions(viewOnlyKeyOfEditor);
    visitWithApiKey(['translations.view', 'screenshots.view']);
    cy.contains('What To Pack').should('be.visible').click({ altKey: true });
    getDevUi()
      .findDcyWithCustom({
        value: 'error-alert',
        'error-code': 'permissions_not_sufficient_to_edit',
      })
      .should(
        'contain.text',
        "the API key this page uses doesn't include that permission"
      )
      // no extension drives this page, so nothing may send the user to a plugin they don't have
      .and('not.contain.text', 'Tolgee plugin');
    getDevUi().findDcy('translation-field-credential-note').should('not.exist');
  });

  it('tells an editor whose API key may only suggest in German that the key is why English is read-only', () => {
    openDialogAs(suggestGermanKeyOfEditor);
    getDevUi().findDcy('error-alert').should('not.exist');
    getDevUi()
      .findDcyWithCustom({
        value: 'translation-field-credential-note',
        language: 'en',
      })
      .should('contain.text', 'API key this page uses')
      .and('not.contain.text', 'Tolgee plugin');
  });
});
