export const getDevUiRoot = () => {
  return cy.get('#__tolgee_dev_tools');
};

export const getDevUi = () => {
  return getDevUiRoot().shadow();
};
