declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject = any> {
    closestDcy(dataCy: string): Chainable;

    gcy(dataCy: string): Chainable;

    findDcy(dataCy: string): Chainable;

    findDcyAdvanced(
      params: { value: string; [key: string]: string },
      options?: Parameters<typeof cy.get>[1]
    ): Chainable;
  }
}
