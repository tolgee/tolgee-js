// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-real-events';

Cypress.Commands.add(
  'closestDcy',
  { prevSubject: 'element' },
  (subject, dataCy) => {
    return cy.wrap(subject).closest(`[data-cy="${dataCy}"]`);
  }
);

Cypress.Commands.add('gcy', (dataCy, options) => {
  return cy.get('[data-cy="' + dataCy + '"]', options);
});

Cypress.Commands.add(
  'findDcy',
  { prevSubject: 'element' },
  (subject, dataCy) => {
    return cy.wrap(subject).find(`[data-cy="${dataCy}"]`);
  }
);

Cypress.Commands.add(
  'findDcyWithCustom',
  { prevSubject: 'element' },
  (subject, { value, ...other }, options) =>
    subject.find(
      `[data-cy="${value}"]${Object.entries(other)
        .map(([key, value]) => `[data-cy-${key}="${value}"]`)
        .join('')}`,
      options
    )
);
