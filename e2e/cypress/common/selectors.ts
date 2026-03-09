import { getDevUi } from './devUiTools';

export const getByAriaLabel = (
  label: string,
  options?: Parameters<typeof cy.get>[1]
) => {
  return getDevUi().find(`*[aria-label="${label}"]`, options);
};

export const gcyWithCustom = (
  { value, ...other }: { value: string; [key: string]: string },
  options?: Parameters<typeof cy.get>[1]
) =>
  cy.get(
    `[data-cy="${value}"]${Object.entries(other)
      .map(([key, value]) => `[data-cy-${key}="${value}"]`)
      .join('')}`,
    options
  );
