import { DEVTOOLS_ID } from '../../constants';

export function getRoot() {
  return document.getElementById(DEVTOOLS_ID)?.shadowRoot as unknown as Element;
}
