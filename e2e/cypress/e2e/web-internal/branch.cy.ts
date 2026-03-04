import {
  login,
  createBranch,
  deleteBranch,
  getDefaultBranch,
  setBranchProtected,
  setFeature,
} from '../../common/apiCalls';
import {
  openUI,
  visitWithApiKey,
  getEditor,
} from '../../common/nextInternalCommon';
import { getDevUi } from '../../common/devUiTools';
import { Scope } from '../../common/types';

const fullScopes: Scope[] = [
  'translations.view',
  'keys.edit',
  'translations.edit',
  'screenshots.view',
  'screenshots.upload',
];

context('Branching', () => {
  let branchId: number | undefined;

  before(() => {
    setFeature('BRANCHING', true);
  });

  after(() => {
    setFeature('BRANCHING', false);
  });

  beforeEach(() => {
    login();
    branchId = undefined;
  });

  afterEach(() => {
    if (branchId !== undefined) {
      deleteBranch(1, branchId);
    }
  });

  it('loads translations with branch param and shows branch name in UI', () => {
    getDefaultBranch(1)
      .then((defaultBranch) =>
        createBranch(1, `e2e-feature-branch-${Date.now()}`, defaultBranch.id)
      )
      .then((branch) => {
        branchId = branch.id;
        cy.intercept({
          path: '/v2/projects/translations**',
          method: 'get',
        }).as('getTranslations');
        visitWithApiKey(fullScopes, ['en', 'de'], branch.name);
      });

    openUI();

    cy.wait('@getTranslations').then(({ request }) => {
      expect(request.url).to.include('branch=e2e-feature-branch-');
    });

    getDevUi().contains('Branch').should('be.visible');
  });

  it('includes branch in translation update request', () => {
    getDefaultBranch(1)
      .then((defaultBranch) =>
        createBranch(1, `e2e-feature-branch-${Date.now()}`, defaultBranch.id)
      )
      .then((branch) => {
        branchId = branch.id;
        cy.intercept(
          { path: '/v2/projects/*/keys/**', method: 'put' },
          (req) => {
            req.reply({ response: 'success' });
          }
        ).as('updateTranslation');
        visitWithApiKey(fullScopes, ['en', 'de'], branch.name);
      });

    openUI();

    getEditor()
      .contains('What To Pack')
      .parent()
      .click()
      .realType('{backspace}'.repeat(20) + 'Updated value');

    getDevUi().findDcy('key-form-submit').click();

    cy.wait('@updateTranslation').then(({ request }) => {
      expect(request.body.branch).to.include('e2e-feature-branch-');
    });
  });

  it('is read-only when branch is protected and API key lacks branch.protected-modify permission', () => {
    getDefaultBranch(1)
      .then((defaultBranch) =>
        createBranch(1, `e2e-protected-branch-${Date.now()}`, defaultBranch.id)
      )
      .then((branch) => {
        branchId = branch.id;
        return setBranchProtected(1, branch.id, true).then(() => branch);
      })
      .then((branch) => {
        visitWithApiKey(fullScopes, ['en', 'de'], branch.name);
      });

    openUI();

    getDevUi().findDcy('key-form-submit').should('be.disabled');
    getDevUi().contains('Read-only mode').should('be.visible');
    getEditor().closestDcy('global-editor').should('have.attr', 'disabled');
  });

  it('shows translations and is not read-only when non-existing branch is selected', () => {
    // Intercept translations so the dialog does not error out on an unknown
    // branch — we only care about the frontend read-only behaviour here.
    cy.intercept(
      { path: '/v2/projects/translations**', method: 'get' },
      (req) => {
        req.reply({
          _embedded: {},
          selectedLanguages: [],
          _internal: { version: 'v3.42.0' },
        });
      }
    );

    visitWithApiKey(fullScopes, ['en', 'de'], 'nonexistent-branch');
    openUI();

    getEditor().should('be.visible');
    getDevUi().findDcy('key-form-submit').should('not.be.disabled');
    getDevUi().contains('Read-only mode').should('not.exist');
  });
});
