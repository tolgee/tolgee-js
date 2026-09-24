export const PASSWORD = Cypress.env('DEFAULT_PASSWORD') || 'admin';
export const USERNAME = Cypress.env('DEFAULT_USERNAME') || 'admin';
export const API_URL = Cypress.env('API_URL') || 'http://localhost:8202';
export const WEB_INTERNAL_URL =
  Cypress.env('WEB_INTERNAL_URL') || 'http://localhost:8114';
