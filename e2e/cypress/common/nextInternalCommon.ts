import { createApiKey, deleteScreenshots, getScreenshots } from './apiCalls';
import { getDevUi, getDevUiRoot } from './devUiTools';
import { Scope } from './types';

export const openUI = (translation = 'On the road') => {
  cy.contains(translation)
    .should('be.visible')
    .trigger('keydown', { key: 'Alt' })
    .trigger('mouseover')
    .click();
  cy.window().trigger('keyup', { key: 'Alt' });
  getDevUiRoot().should('exist');
  getDevUi().find('textarea').contains(translation).should('be.visible');
  cy.wait(300);
};

export const removeScreenshots = () => {
  getScreenshots(1, 1000007006).then((data) => {
    const screenshotIds = data._embedded?.screenshots.map((sc) => sc.id);
    if (screenshotIds) {
      return deleteScreenshots(1, 1000007006, screenshotIds);
    }
  });
};

export const visitWithApiKey = (scopes: Scope[]) => {
  createApiKey({ projectId: 1, scopes })
    .then((data) => {
      cy.visit(`http://localhost:8114/?api_key=${data.key}`);
    })
    .then(() =>
      localStorage.setItem('__tolgee_preferredLanguages', '["en","de"]')
    );
  cy.contains('On the road').invoke('attr', '_tolgee').should('exist');
};
