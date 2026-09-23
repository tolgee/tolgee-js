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
// own-access scope, so the key is created with plain view scope and everything suggestion-related is mocked.
const openWithSuggestions = (
  permissions: ApiKeyPermissionsModel,
  { languagesWithSuggestions = ['en'], pluralKey = false, count = 5 } = {}
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
      })
  );
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

  visitWithApiKey(['translations.view', 'screenshots.view']);
  openUI();
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

  it('declines, and deletes only own suggestion', () => {
    openWithSuggestions(reviewer);
    getSuggestionsList('en').findDcy('suggestion-decline').eq(1).click();
    cy.wait('@decline').its('request.url').should('contain', '/suggestion/4/');
    shouldShowEnglishSuggestions([5, 3, 2]);

    openMenuOfSuggestion('en', 0);
    getSuggestionsList('en').findDcy('suggestion-delete').click();
    cy.wait('@delete').its('request.url').should('contain', '/suggestion/5');
    shouldShowEnglishSuggestions([3, 2, 1]);

    openMenuOfSuggestion('en', 0);
    getSuggestionsList('en')
      .findDcy('suggestion-accept-decline-others')
      .should('be.visible');
    getSuggestionsList('en').findDcy('suggestion-delete').should('not.exist');
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
      .find(
        '[data-cy="error-alert"][data-cy-error-code="suggestions_disabled"]'
      )
      .should('be.visible');
    shouldShowEnglishSuggestions([5, 4, 3]);

    openMenuOfSuggestion('en', 0);
    getSuggestionsList('en').findDcy('suggestion-delete').click();
    shouldShowEnglishSuggestions([4, 3, 2]);
    getSuggestionsList('en').findDcy('error-alert').should('not.exist');
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
