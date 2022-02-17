declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject = any> {
    closestDcy(dataCy: string): Chainable;

    gcy(dataCy: string): Chainable;

    findDcy(dataCy: string): Chainable;
  }
}
