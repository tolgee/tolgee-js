import { createApiKey } from './apiCalls';
import { getDevUi, getDevUiRoot } from './devUiTools';
import { Scope } from './types';

export const openUI = (translation = 'What To Pack') => {
  cy.contains(translation).should('be.visible').click({ altKey: true });
  getDevUiRoot().should('exist');
  getEditor().should('not.be.disabled');
  cy.wait(300);
};

export const visitWithApiKey = (
  scopes: Scope[],
  languages = ['en', 'de'],
  branch?: string
) => {
  createApiKey({ projectId: 1, scopes })
    .then((data) => {
      const params = new URLSearchParams({ api_key: data.key });
      if (branch) params.set('branch', branch);
      cy.visit(
        `http://localhost:8114/translation-methods?${params.toString()}`
      );
    })
    .then(() =>
      localStorage.setItem(
        '__tolgee_preferredLanguages',
        JSON.stringify(languages)
      )
    );
  cy.contains('What To Pack').invoke('attr', '_tolgee').should('exist');
};

export const getEditor = () => {
  return getDevUi().findDcy('global-editor').find('.cm-content');
};
