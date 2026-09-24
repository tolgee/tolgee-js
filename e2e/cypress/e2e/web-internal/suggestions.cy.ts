import { login } from '../../common/apiCalls';
import { getDevUi, getSuggestionsList } from '../../common/devUiTools';
import { openUI, visitWithApiKey } from '../../common/nextInternalCommon';
import {
  ApiKeyPermissionsModel,
  mockPermissions,
} from '../../common/simulateReqAndResponse';
import { fullPermissions } from '../../common/testApiKeys';

const ME = 1;
const SOMEONE_ELSE = 2;
const ENGLISH_ID = 1000000001;
const GERMAN_ID = 1000000000;

const reviewer: ApiKeyPermissionsModel = {
  ...fullPermissions,
  userId: ME,
  suggestionsMode: 'ENABLED',
  translationProtection: 'NONE',
  scopes: [
    ...fullPermissions.scopes,
    'translations.suggest',
    'translation-suggestions.own-access',
  ],
};

const contributor: ApiKeyPermissionsModel = {
  ...reviewer,
  scopes: [
    'translations.view',
    'translations.suggest',
    'translation-suggestions.own-access',
  ],
};

const THREE_DAYS_AGO = new Date(
  Date.now() - 3 * 24 * 60 * 60 * 1000
).toISOString();

const suggestion = (id: number, authorId: number) => ({
  id,
  keyId: 1,
  languageId: 1,
  translation: `Suggested title ${id}`,
  isPlural: false,
  state: 'ACTIVE',
  author: { id: authorId, username: `user${authorId}`, deleted: false },
  createdAt: THREE_DAYS_AGO,
  updatedAt: THREE_DAYS_AGO,
});

const newestFirst = () => [
  suggestion(5, ME),
  suggestion(4, SOMEONE_ELSE),
  suggestion(3, SOMEONE_ELSE),
  suggestion(2, SOMEONE_ELSE),
  suggestion(1, SOMEONE_ELSE),
];

const PLURAL_TEXT = '{count, plural, one {# thing} other {# things}}';

const suggestionIdFromUrl = (url: string) =>
  Number(url.match(/\/suggestion\/(\d+)/)[1]);

// The suite runs against the released platform image, which knows neither the new permission fields nor the
// own-access scope.
const openWithSuggestions = (
  permissions: ApiKeyPermissionsModel,
  {
    languagesWithSuggestions = ['en'],
    pluralKey = false,
    count = 5,
    untranslatedLanguage = undefined as string | undefined,
    createFailsForLanguageId = undefined as number | undefined,
  } = {}
) => {
  let active = newestFirst()
    .slice(0, count)
    .map((s) => (pluralKey ? { ...s, translation: PLURAL_TEXT } : s));
  const removeFromActive = (url: string) => {
    active = active.filter((s) => s.id !== suggestionIdFromUrl(url));
  };

  // Registers the permissions and languages intercepts. Its language glob also matches the suggestion
  // url below, and Cypress lets the last matching intercept win, so it has to come first.
  mockPermissions(permissions);
  // The browser plugin's page proxy refuses this endpoint, so the dialog must work without it.
  cy.intercept({ path: '/v2/user', method: 'get' }, (req) =>
    req.reply({ statusCode: 403 })
  );
  cy.intercept(
    { path: '/v2/projects/*/translations?**', method: 'get' },
    (req) =>
      req.continue((res) => {
        const key = res.body?._embedded?.keys?.[0];
        if (key && pluralKey) {
          key.keyIsPlural = true;
          key.keyPluralArgName = 'count';
        }
        const translations = key?.translations;
        languagesWithSuggestions.forEach((tag) => {
          if (translations?.[tag]) {
            translations[tag].activeSuggestionCount = active.length;
          }
        });
        if (translations && untranslatedLanguage) {
          // what the server sends for a language the key was never translated into: no translation
          // record, so no count, but the suggestions of that language are still listed
          translations[untranslatedLanguage] = {
            id: null,
            state: 'UNTRANSLATED',
            text: null,
            activeSuggestionCount: 0,
            totalSuggestionCount: 0,
            suggestions: active.slice(0, 1),
            auto: false,
            commentCount: 0,
            unresolvedCommentCount: 0,
            fromTranslationMemory: false,
            outdated: false,
            qaChecksStale: false,
            qaIssueCount: 0,
          };
        }
      })
  ).as('translations');
  cy.intercept(
    { path: '/v2/projects/*/languages/*/key/*/suggestion?**', method: 'get' },
    (req) => {
      const size = Number(req.query.size);
      req.reply({
        _embedded: { suggestions: active.slice(0, size) },
        page: { size, totalElements: active.length, totalPages: 1, number: 0 },
      });
    }
  ).as('getSuggestions');
  cy.intercept(
    {
      path: '/v2/projects/*/languages/*/key/*/suggestion/*/accept**',
      method: 'put',
    },
    (req) => {
      const accepted = active.find(
        (s) => s.id === suggestionIdFromUrl(req.url)
      );
      const declined =
        req.query.declineOther === 'true'
          ? active.filter((s) => s !== accepted).map((s) => s.id)
          : [];
      active = active.filter((s) => s !== accepted && !declined.includes(s.id));
      req.reply({ accepted: { ...accepted, state: 'ACCEPTED' }, declined });
    }
  ).as('accept');
  cy.intercept(
    {
      path: '/v2/projects/*/languages/*/key/*/suggestion/*/decline',
      method: 'put',
    },
    (req) => {
      removeFromActive(req.url);
      req.reply({});
    }
  ).as('decline');
  cy.intercept(
    { path: '/v2/projects/*/languages/*/key/*/suggestion/*', method: 'delete' },
    (req) => {
      removeFromActive(req.url);
      req.reply({});
    }
  ).as('delete');
  cy.intercept(
    { path: '/v2/projects/*/languages/*/key/*/suggestion', method: 'post' },
    (req) => {
      if (
        createFailsForLanguageId &&
        req.url.includes(`/languages/${createFailsForLanguageId}/`)
      ) {
        req.reply({ statusCode: 400, body: { code: 'suggestions_disabled' } });
        return;
      }
      active = [suggestion(active.length + 1, ME), ...active];
      req.reply({});
    }
  ).as('create');

  visitWithApiKey(['translations.view', 'screenshots.view']);
  openUI();
};

const retype = (language: string, text: string) => {
  getDevUi()
    .findDcyWithCustom({ value: 'translation-field', language })
    .find('.cm-content')
    .click()
    .realType('{backspace}'.repeat(20) + text);
};

const openMenuOfSuggestion = (language: string, index: number) => {
  getSuggestionsList(language).findDcy('suggestion-menu').eq(index).click();
};

const shouldShowEnglishSuggestions = (ids: number[]) => {
  getSuggestionsList('en')
    .findDcy('suggestion-item-text')
    .should((items) => {
      expect(items.toArray().map((item) => item.textContent)).to.deep.eq(
        ids.map((id) => `Suggested title ${id}`)
      );
    });
};

context('Suggestions in the dialog', () => {
  beforeEach(() => {
    login();
  });

  it('shows the 3 most recent and loads more', () => {
    openWithSuggestions(reviewer);
    cy.wait('@getSuggestions').then(({ request }) => {
      const query = new URL(request.url).searchParams;
      expect(query.getAll('filterState')).to.deep.eq(['ACTIVE']);
      expect(query.getAll('sort')).to.deep.eq(['createdAt,desc', 'id,desc']);
    });
    shouldShowEnglishSuggestions([5, 4, 3]);
    getSuggestionsList('en')
      .findDcy('suggestion-item-meta')
      .first()
      .should('contain', '3d ago');
    getSuggestionsList('de').should('not.exist');

    getSuggestionsList('en').findDcy('suggestions-show-more').click();
    shouldShowEnglishSuggestions([5, 4, 3, 2, 1]);
    getSuggestionsList('en')
      .findDcy('suggestions-show-more')
      .should('not.exist');
  });

  it('accepts one suggestion and keeps the others', () => {
    openWithSuggestions(reviewer);
    getSuggestionsList('en').findDcy('suggestion-accept').first().click();
    cy.wait('@accept').then(({ request }) => {
      expect(request.url).to.contain('/suggestion/5/accept');
      expect(request.url).not.to.contain('declineOther');
    });
    shouldShowEnglishSuggestions([4, 3, 2]);
    cy.contains('Suggested title 5').should('be.visible');
  });

  it('keeps only accept and decline in the row', () => {
    openWithSuggestions(reviewer);
    getSuggestionsList('en')
      .findDcy('suggestion-accept')
      .should('have.length', 3);
    getSuggestionsList('en')
      .findDcy('suggestion-decline')
      .should('have.length', 3);
    getSuggestionsList('en')
      .findDcy('suggestion-accept-decline-others')
      .should('not.exist');
    getSuggestionsList('en').findDcy('suggestion-delete').should('not.exist');

    openMenuOfSuggestion('en', 0);
    getSuggestionsList('en')
      .findDcy('suggestion-accept-decline-others')
      .should('be.visible');
    getSuggestionsList('en').findDcy('suggestion-delete').should('be.visible');
  });

  it('says accept only while other suggestions are standing', () => {
    openWithSuggestions(reviewer);
    // the tooltip text reaches the DOM as the button's aria-label until it is hovered
    getSuggestionsList('en')
      .findDcy('suggestion-accept')
      .first()
      .should('have.attr', 'aria-label', 'Accept only');
  });

  it('says plain accept and offers no menu for the last suggestion', () => {
    openWithSuggestions(reviewer, { count: 1 });
    getSuggestionsList('en')
      .findDcy('suggestion-accept')
      .should('have.length', 1)
      .and('have.attr', 'aria-label', 'Accept');
    getSuggestionsList('en')
      .findDcy('suggestion-menu')
      .should('have.length', 1);
    openMenuOfSuggestion('en', 0);
    getSuggestionsList('en')
      .findDcy('suggestion-accept-decline-others')
      .should('not.exist');
    getSuggestionsList('en').findDcy('suggestion-delete').should('be.visible');
  });

  it('accepts one suggestion and declines the others', () => {
    openWithSuggestions(reviewer);
    openMenuOfSuggestion('en', 0);
    getSuggestionsList('en')
      .findDcy('suggestion-accept-decline-others')
      .click();
    cy.wait('@accept')
      .its('request.url')
      .should('contain', 'declineOther=true');
    cy.contains('Suggested title 5').should('be.visible');
    getDevUi().findDcy('translation-field').should('be.visible');
    getSuggestionsList('en').should('not.exist');
  });

  // Each action gets its own dialog: an action re-renders the row as it locks, refetches and
  // refreshes, and Cypress 10 pins the element it resolved, so a second click in the same test
  // lands on a detached button. Which rows offer delete is covered by the permission cases below.
  it('declines someone else’s suggestion', () => {
    openWithSuggestions(reviewer);
    getSuggestionsList('en').findDcy('suggestion-decline').eq(1).click();
    cy.wait('@decline').its('request.url').should('contain', '/suggestion/4/');
    shouldShowEnglishSuggestions([5, 3, 2]);
  });

  it('deletes the current user’s own suggestion', () => {
    openWithSuggestions(reviewer);
    openMenuOfSuggestion('en', 0);
    getSuggestionsList('en').findDcy('suggestion-delete').click();
    cy.wait('@delete').its('request.url').should('contain', '/suggestion/5');
    shouldShowEnglishSuggestions([4, 3, 2]);
  });

  it('offers review actions only for the permitted language', () => {
    openWithSuggestions(
      { ...reviewer, stateChangeLanguageIds: [ENGLISH_ID] },
      { languagesWithSuggestions: ['en', 'de'] }
    );
    getSuggestionsList('en')
      .findDcy('suggestion-decline')
      .should('have.length', 3);
    getSuggestionsList('de')
      .findDcy('suggestion-item')
      .should('have.length', 3);
    getSuggestionsList('de').findDcy('suggestion-accept').should('not.exist');
    getSuggestionsList('de').findDcy('suggestion-decline').should('not.exist');
    getSuggestionsList('de')
      .findDcy('suggestion-menu')
      .should('have.length', 1);
    openMenuOfSuggestion('de', 0);
    getSuggestionsList('de').findDcy('suggestion-delete').should('be.visible');
    getSuggestionsList('de')
      .findDcy('suggestion-accept-decline-others')
      .should('not.exist');
  });

  it('lists suggestions for a language the key was never translated into', () => {
    openWithSuggestions(reviewer, { untranslatedLanguage: 'de' });
    // the payload's German entry carries no count, only the suggestion itself; the list endpoint is
    // mocked per key rather than per language, so what matters here is that the panel loads at all
    getSuggestionsList('de').should('be.visible');
    getSuggestionsList('de')
      .findDcy('suggestion-item-text')
      .should('have.length.at.least', 1)
      .and('contain', 'Suggested title');
    getSuggestionsList('de')
      .findDcy('suggestion-accept')
      .should('have.length.at.least', 1);
  });

  it('locks the actions while the dialog is saving', () => {
    openWithSuggestions(reviewer);
    cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, (req) =>
      req.reply({ body: { response: 'success' }, delay: 2000 })
    ).as('save');

    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language: 'en' })
      .find('.cm-content')
      .click()
      .realType('{backspace}'.repeat(20) + 'What to take');
    getDevUi().findDcy('key-form-submit').click();

    getSuggestionsList('en')
      .findDcy('suggestion-accept')
      .first()
      .should('be.disabled');
    getSuggestionsList('en')
      .findDcy('suggestion-decline')
      .first()
      .should('be.disabled');
    getSuggestionsList('en')
      .findDcy('suggestion-menu')
      .first()
      .should('be.disabled');
    cy.wait('@save');
  });

  it('adds a suggestion made from the form to the open list', () => {
    // German fails so the dialog stays open after the submit: this has to prove that the list the
    // user is looking at refreshes, not that a freshly mounted dialog loads what is on the server
    openWithSuggestions(contributor, {
      createFailsForLanguageId: GERMAN_ID,
    });
    shouldShowEnglishSuggestions([5, 4, 3]);

    retype('en', 'Suggested title 6');
    retype('de', 'Vorschlag');
    getDevUi().findDcy('key-form-submit').click();
    cy.wait(['@create', '@create']);

    getDevUi().findDcy('key-form-submit').should('exist');
    shouldShowEnglishSuggestions([6, 5, 4]);
  });

  it('shows a plural suggestion form by form', () => {
    openWithSuggestions(contributor, { pluralKey: true });
    getSuggestionsList('en')
      .findDcy('suggestion-item')
      .first()
      .findDcy('translation-plural-variant')
      .should((forms) => {
        expect(forms.toArray().map((form) => form.textContent)).to.deep.eq([
          '# thing',
          '# things',
        ]);
      });
  });

  it('offers no own delete when the server does not say who the user is', () => {
    openWithSuggestions({ ...contributor, userId: undefined });
    shouldShowEnglishSuggestions([5, 4, 3]);
    getSuggestionsList('en').findDcy('suggestion-menu').should('not.exist');
  });

  it('contributor sees suggestions and can only delete their own', () => {
    openWithSuggestions(contributor);
    shouldShowEnglishSuggestions([5, 4, 3]);
    getSuggestionsList('en').findDcy('suggestion-accept').should('not.exist');
    getSuggestionsList('en').findDcy('suggestion-decline').should('not.exist');
    getSuggestionsList('en')
      .findDcy('suggestion-menu')
      .should('have.length', 1);

    openMenuOfSuggestion('en', 0);
    getSuggestionsList('en').findDcy('suggestion-delete').should('be.visible');
    getSuggestionsList('en')
      .findDcy('suggestion-accept-decline-others')
      .should('not.exist');
  });

  it('shows the error of a failed action until the next action', () => {
    openWithSuggestions(reviewer);
    cy.intercept(
      {
        path: '/v2/projects/*/languages/*/key/*/suggestion/*/decline',
        method: 'put',
      },
      (req) =>
        req.reply({ statusCode: 400, body: { code: 'suggestions_disabled' } })
    );
    getSuggestionsList('en').findDcy('suggestion-decline').first().click();
    getSuggestionsList('en')
      .findDcyWithCustom({
        value: 'error-alert',
        'error-code': 'suggestions_disabled',
      })
      .should('be.visible');
    shouldShowEnglishSuggestions([5, 4, 3]);

    openMenuOfSuggestion('en', 0);
    getSuggestionsList('en').findDcy('suggestion-delete').click();
    shouldShowEnglishSuggestions([4, 3, 2]);
    getSuggestionsList('en').findDcy('error-alert').should('not.exist');
  });

  it('keeps the rest of the form when accepting refreshes the key', () => {
    openWithSuggestions(reviewer);
    cy.intercept({ path: '/v2/projects/*/tags**', method: 'get' }).as(
      'getTags'
    );

    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language: 'en' })
      .find('.cm-content')
      .click()
      .realType('{backspace}'.repeat(20) + 'Typed english');
    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language: 'de' })
      .find('.cm-content')
      .click()
      .realType('{backspace}'.repeat(20) + 'Hallo Welt');
    getDevUi()
      .findDcy('tag-autocomplete-input')
      .scrollIntoView()
      .click({ force: true })
      .type('test-tag');
    cy.wait('@getTags');
    getDevUi().findDcy('tag-autocomplete-option').contains('test-tag').click();

    getSuggestionsList('en').findDcy('suggestion-accept').first().click();
    cy.wait('@accept');
    shouldShowEnglishSuggestions([4, 3, 2]);

    // English is the accepted language, so the refresh re-seeds it from the server: once that shows,
    // the whole form has been overwritten and what is kept had to survive it
    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language: 'en' })
      .should('not.contain.text', 'Typed english');
    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language: 'de' })
      .should('contain.text', 'Hallo Welt');
    getDevUi().findDcy('translations-tag-close').should('have.length', 1);
    getDevUi().should('contain.text', 'test-tag');
  });

  it('is hidden when suggestions are disabled', () => {
    openWithSuggestions({ ...reviewer, suggestionsMode: 'DISABLED' });
    getDevUi().findDcy('translation-field').should('be.visible');
    getDevUi().findDcy('suggestions-list').should('not.exist');
  });

  it('is hidden on a server that does not report the suggestions mode', () => {
    openWithSuggestions(fullPermissions);
    getDevUi().findDcy('translation-field').should('be.visible');
    getDevUi().findDcy('suggestions-list').should('not.exist');
  });
});
