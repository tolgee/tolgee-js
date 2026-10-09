import { login } from '../../common/apiCalls';
import { getDevUi } from '../../common/devUiTools';
import {
  openUI,
  retype,
  visitWithApiKey,
} from '../../common/nextInternalCommon';
import {
  ApiKeyPermissionsModel,
  mockPermissions,
} from '../../common/simulateReqAndResponse';
import {
  suggestOnly,
  translateEnglishSuggestRest,
  editEnglishSuggestRestWithTags,
  editorOnProtectedProject,
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

  it('keeps every field and the dialog when all suggestions fail', () => {
    openDialogAs(suggestOnly);
    cy.intercept({ path: '/v2/projects/*/translations**', method: 'get' }).as(
      'translations'
    );
    cy.intercept({ path: SUGGESTION_URL, method: 'post' }, (req) =>
      req.reply({ statusCode: 409, body: { code: 'suggestions_disabled' } })
    ).as('suggest');

    retype('en', 'Hello world');
    retype('de', 'Hallo Welt');
    getDevUi().findDcy('key-form-submit').click();
    cy.wait(['@suggest', '@suggest']);
    cy.wait('@translations');

    getDevUi()
      .findDcyWithCustom({ value: 'translation-field-error', language: 'en' })
      .should('be.visible');
    getDevUi()
      .findDcyWithCustom({ value: 'translation-field-error', language: 'de' })
      .should('be.visible');
    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language: 'en' })
      .should('contain.text', 'Hello world');
    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language: 'de' })
      .should('contain.text', 'Hallo Welt');
    getDevUi().findDcy('key-form-submit').should('not.be.disabled');
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

  it("labels the submit 'Save & suggest' once tags and states ride on it, and leaves an untouched translation out of the update", () => {
    openDialogAs(editEnglishSuggestRestWithTags);

    cy.intercept({ path: '/v2/projects/*/tags**', method: 'get' }).as(
      'getTags'
    );
    cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, (req) =>
      req.reply({})
    ).as('update');
    cy.intercept({ path: SUGGESTION_URL, method: 'post' }, (req) =>
      req.reply({})
    ).as('suggest');

    retype('de', 'Hallo Welt');
    getDevUi().findDcy('key-form-submit').should('have.text', 'Suggest');

    getDevUi()
      .findDcyWithCustom({ value: 'translation-state-button', language: 'en' })
      .click();
    getDevUi().findDcy('key-form-submit').should('have.text', 'Save & suggest');
    getDevUi()
      .findDcy('tag-autocomplete-input')
      .should('be.visible')
      .click()
      .type('test-tag');
    cy.wait('@getTags');
    getDevUi().findDcy('tag-autocomplete-option').contains('test-tag').click();

    getDevUi()
      .findDcy('key-form-submit')
      .should('have.text', 'Save & suggest')
      .click();

    cy.wait('@update').then(({ request }) => {
      expect(request.body.translations).to.deep.eq({});
      expect(request.body.states).to.deep.eq({ en: 'REVIEWED' });
      expect(request.body.tags).to.deep.eq(['test-tag']);
    });
    cy.wait('@suggest').then(({ request }) => {
      expect(request.url).to.contain(`/languages/${DE_ID}/key/`);
      expect(request.body).to.deep.eq({ translation: 'Hallo Welt' });
    });
  });

  it("turns an editor's change to a reviewed translation into a suggestion and says why", () => {
    cy.intercept(
      { path: '/v2/projects/*/translations**', method: 'get' },
      (req) =>
        req.continue((res) => {
          const key = res.body._embedded?.keys?.[0];
          expect(key, 'the imported key in the translations response').to.exist;
          key.translations.en.state = 'REVIEWED';
        })
    );
    openDialogAs(editorOnProtectedProject);

    getDevUi()
      .findDcyWithCustom({
        value: 'translation-field-suggest-note',
        language: 'en',
        kind: 'reviewedProtected',
      })
      .should(
        'have.text',
        'Reviewed translations are protected. Your change will be sent as a suggestion.'
      );
    getDevUi()
      .findDcyWithCustom({
        value: 'translation-field-suggest-note',
        language: 'de',
      })
      .should('not.exist');

    retype('de', 'Hallo Welt');
    getDevUi().findDcy('key-form-submit').should('have.text', 'Save');
    retype('en', 'Hello world');
    getDevUi().findDcy('key-form-submit').should('have.text', 'Save & suggest');
  });

  it("says an emptied suggestion can't be sent and leaves the field out of the submit", () => {
    openDialogAs(suggestOnly);

    retype('en', '');
    getDevUi()
      .findDcyWithCustom({
        value: 'translation-field-suggest-note',
        language: 'en',
        kind: 'cleared',
      })
      .should(
        'have.text',
        "An empty suggestion can't be sent — this field is left unchanged."
      );
    getDevUi().findDcy('key-form-submit').should('be.disabled');

    retype('de', 'Hallo Welt');
    getDevUi()
      .findDcyWithCustom({
        value: 'translation-field-suggest-note',
        language: 'en',
        kind: 'cleared',
      })
      .should('exist');
    cy.intercept({ path: SUGGESTION_URL, method: 'post' }, (req) =>
      req.reply({})
    ).as('suggest');

    getDevUi().findDcy('key-form-submit').should('not.be.disabled').click();

    cy.wait('@suggest').then(({ request }) => {
      expect(request.url).to.contain(`/languages/${DE_ID}/key/`);
    });
    cy.get('@suggest.all').should('have.length', 1);
  });

  it('tells an editor whose API key is view-only that the key, not a plugin, is the limit', () => {
    mockPermissions(viewOnlyKeyOfEditor);
    visitWithApiKey(['translations.view', 'screenshots.view']);
    openUI('What To Pack', { editable: false });
    getDevUi()
      .findDcyWithCustom({
        value: 'error-alert',
        'error-code': 'permissions_not_sufficient_to_edit',
      })
      .should(
        'contain.text',
        "The API key this page uses doesn't have this permission"
      )
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

  it('shows the key description under the key name, and nothing when there is none', () => {
    openDialogAs(suggestOnly);
    getDevUi().findDcy('key-description').should('not.exist');

    cy.intercept(
      { path: '/v2/projects/*/translations**', method: 'get' },
      (req) =>
        req.continue((res) => {
          const key = res.body._embedded?.keys?.[0];
          expect(key, 'the imported key in the translations response').to.exist;
          key.keyDescription = 'Shown on the packing page';
        })
    );
    openDialogAs(suggestOnly);
    getDevUi()
      .findDcy('key-description')
      .should('have.text', 'Shown on the packing page');
  });
});
