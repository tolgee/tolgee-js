import { login } from '../../common/apiCalls';
import {
  openUI,
  visitWithApiKey,
  getEditor,
} from '../../common/nextInternalCommon';
import { getDevUi } from '../../common/devUiTools';
import { fullPermissions } from '../../common/testApiKeys';
import { Scope } from '../../common/types';

const fullScopes: Scope[] = [
  'translations.view',
  'keys.edit',
  'translations.edit',
  'screenshots.view',
  'screenshots.upload',
];

const protectedBranchResponse = {
  id: 1,
  name: 'protected-branch',
  isProtected: true,
  isDefault: false,
  active: true,
};

context('Branching', () => {
  beforeEach(() => {
    login();
  });

  it('loads translations with branch param and shows branch name in UI', () => {
    cy.intercept(
      { path: '/v2/projects/translations**', method: 'get' },
      (req) => {
        req.continue();
      }
    ).as('getTranslations');

    visitWithApiKey(fullScopes, ['en', 'de'], 'feature-branch');
    openUI();

    cy.wait('@getTranslations').then(({ request }) => {
      expect(request.url).to.include('branch=feature-branch');
    });

    getDevUi().contains('feature-branch').should('be.visible');
  });

  it('includes branch in translation update request', () => {
    visitWithApiKey(fullScopes, ['en', 'de'], 'feature-branch');
    openUI();

    cy.intercept(
      { path: '/v2/projects/*/keys/**', method: 'put' },
      (req) => {
        req.reply({ response: 'success' });
      }
    ).as('updateTranslation');

    getEditor()
      .contains('What To Pack')
      .parent()
      .click()
      .realType('{backspace}'.repeat(20) + 'Updated value');

    getDevUi().findDcy('key-form-submit').click();

    cy.wait('@updateTranslation').then(({ request }) => {
      expect(request.body.branch).to.equal('feature-branch');
    });
  });

  it('is read-only when branch is protected and API key lacks branch.protected-modify permission', () => {
    cy.intercept(
      { path: '/v2/api-keys/current-permissions', method: 'get' },
      (req) => {
        req.reply({
          ...fullPermissions,
          scopes: fullPermissions.scopes.filter(
            (s) => s !== 'branch.protected-modify'
          ),
        });
      }
    );

    cy.intercept(
      { path: '/v2/projects/branches/find**', method: 'get' },
      (req) => {
        req.reply(protectedBranchResponse);
      }
    );

    visitWithApiKey(fullScopes, ['en', 'de'], 'protected-branch');
    openUI();

    getDevUi().findDcy('key-form-submit').should('be.disabled');
    getDevUi().contains('Read-only mode').should('be.visible');
    getEditor()
      .closestDcy('global-editor')
      .should('have.attr', 'disabled');
  });

  it('shows translations and is not read-only when non-existing branch is selected', () => {
    cy.intercept(
      { path: '/v2/projects/branches/find**', method: 'get' },
      { statusCode: 404, body: { code: 'branch_not_found' } }
    );

    visitWithApiKey(fullScopes, ['en', 'de'], 'nonexistent-branch');
    openUI();

    getEditor().should('be.visible');
    getDevUi().findDcy('key-form-submit').should('not.be.disabled');
    getDevUi().contains('Read-only mode').should('not.exist');
  });
});
