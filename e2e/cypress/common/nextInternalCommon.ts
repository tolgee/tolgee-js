import { createApiKey } from './apiCalls';
import { WEB_INTERNAL_URL } from './constants';
import { getDevUi, getDevUiRoot } from './devUiTools';
import { Scope } from './types';

export const openUI = (
  translation = 'What To Pack',
  { editable = true }: { editable?: boolean } = {}
) => {
  cy.contains(translation).should('be.visible').click({ altKey: true });
  getDevUiRoot().should('exist');
  getDevUi()
    .find('.MuiDialog-container', { timeout: 10000 })
    .should('be.visible');
  getEditor().should('be.visible');
  if (editable) {
    getEditor().should('not.be.disabled');
  }
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
      cy.visit(`${WEB_INTERNAL_URL}/translation-methods?${params.toString()}`);
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

export const retype = (language: string, text: string) => {
  const editor = () =>
    getDevUi()
      .findDcyWithCustom({ value: 'translation-field', language })
      .find('.cm-content');
  editor()
    .click()
    .realPress([Cypress.platform === 'darwin' ? 'Meta' : 'Control', 'a'])
    .realPress('Backspace');
  if (text) {
    editor().realType(text);
  }
};
