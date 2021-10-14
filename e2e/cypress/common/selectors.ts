export const getByAriaLabel = (label: string) => {
  return cy.get(`*[aria-label="${label}"]`);
};
