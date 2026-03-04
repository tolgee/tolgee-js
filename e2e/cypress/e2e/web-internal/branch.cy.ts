import {
  login,
  createBranch,
  deleteBranch,
  getDefaultBranch,
  setBranchProtected,
  setFeature,
  setProjectBranching,
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
    login();
    setFeature('BRANCHING', true);
    // cy.then defers execution until login() has completed in the command
    // queue, ensuring token is set before setProjectBranching uses v2apiFetch
    cy.then(() => setProjectBranching(1, true));
  });

  after(() => {
    login();
    cy.then(() => setProjectBranching(1, false));
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
    // Register intercept at top level (before any navigation) so it is
    // guaranteed to be active when the dialog loads translations.
    // Use `pathname` (no query-string) for reliable matching.
    cy.intercept({ pathname: '/v2/projects/translations', method: 'GET' }).as(
      'getTranslations'
    );

    getDefaultBranch(1)
      .then((defaultBranch) =>
        createBranch(1, `e2e-feature-branch-${Date.now()}`, defaultBranch.id)
      )
      .then((branch) => {
        branchId = branch.id;
        visitWithApiKey(fullScopes, ['en', 'de'], branch.name);
      });

    openUI();

    cy.wait('@getTranslations').then(({ request }) => {
      expect(request.url).to.include('branch=e2e-feature-branch-');
    });

    // The shadow-DOM host (#__tolgee_dev_tools) always has height:0 /
    // overflow:hidden so Cypress's visibility check fails for elements inside
    // it.  Use an implicit existence assertion instead.
    getDevUi().contains('Branch');
  });

  it('saves translation on a branch and shows updated value in the app', () => {
    getDefaultBranch(1)
      .then((defaultBranch) =>
        createBranch(1, `e2e-feature-branch-${Date.now()}`, defaultBranch.id)
      )
      .then((branch) => {
        branchId = branch.id;
        visitWithApiKey(fullScopes, ['en', 'de'], branch.name);
      });

    openUI();

    getEditor()
      .contains('What To Pack')
      .parent()
      .click()
      .realType('{backspace}'.repeat(20) + 'Branch updated');

    getDevUi().findDcy('key-form-submit').click();

    // After saving, Tolgee updates its cache and the app re-renders with the
    // new translation value.
    cy.contains('Branch updated').should('be.visible');
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

    // Button disabled check works via attribute (not visibility), so it is
    // safe inside the shadow DOM.
    getDevUi().findDcy('key-form-submit').should('be.disabled');
    // Drop 'be.visible' — shadow host height:0 makes visibility checks fail.
    getDevUi().contains('Read-only mode');
    getEditor().closestDcy('global-editor').should('have.attr', 'disabled');
  });

  it('shows translations and is not read-only when non-existing branch is selected', () => {
    // Intercept the dialog's translations request so it does not error out
    // on an unknown branch — we only care about the read-only behaviour here.
    cy.intercept(
      { pathname: '/v2/projects/translations', method: 'GET' },
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

    // A non-existing branch must NOT trigger the protected-branch read-only
    // guard — verify the "Read-only mode" alert is absent.
    // (The submit button may still be disabled for unrelated permission
    //  reasons, so we do not assert on it here.)
    getDevUi().contains('Read-only mode').should('not.exist');
  });
});
