export const PASSWORD = Cypress.expose('DEFAULT_PASSWORD') || 'admin';
export const USERNAME = Cypress.expose('DEFAULT_USERNAME') || 'admin';
export const API_URL = Cypress.expose('API_URL') || 'http://localhost:8202';
export const WEB_INTERNAL_URL =
  Cypress.expose('WEB_INTERNAL_URL') || 'http://localhost:8114';
