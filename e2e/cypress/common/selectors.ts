import { getDevUi } from './devUiTools';

export const getByAriaLabel = (label: string) => {
  return getDevUi().find(`*[aria-label="${label}"]`);
};
