import { createApiKey } from './apiCalls';
import { getDevUi, getDevUiRoot } from './devUiTools';
import { Scope } from './types';

export const openUI = (translation = 'What To Pack') => {
  cy.contains(translation).should('be.visible').click({ altKey: true });
  getDevUiRoot().should('exist');
  getEditor().should('not.be.disabled');
  cy.wait(300);
};

export const visitWithApiKey = (scopes: Scope[], languages = ['en', 'de']) => {
  createApiKey({ projectId: 1, scopes })
    .then((data) => {
      cy.visit(`http://localhost:8114/translation-methods?api_key=${data.key}`);
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
