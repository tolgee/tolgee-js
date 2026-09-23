export const getDevUiRoot = () => {
  return cy.get('#__tolgee_dev_tools');
};

export const getDevUi = () => {
  return getDevUiRoot().shadow().find('div').first();
};

export const getSuggestionsList = (language: string) => {
  return getDevUi().find(
    `[data-cy="suggestions-list"][data-cy-language="${language}"]`
  );
};
