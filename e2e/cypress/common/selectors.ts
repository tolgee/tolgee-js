import { getDevUi } from './devUiTools';

export const getByAriaLabel = (label: string) => {
  return getDevUi().find(`*[aria-label="${label}"]`);
};

export const gcyAdvanced = (
  { value, ...other }: { value: string; [key: string]: string },
  options?: Parameters<typeof cy.get>[1]
) =>
  cy.get(
    `[data-cy="${value}"]${Object.entries(other)
      .map(([key, value]) => `[data-cy-${key}="${value}"]`)
      .join('')}`,
    options
  );
