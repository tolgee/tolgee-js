import { DEVTOOLS_ID } from '../constants';

export function getRootElement() {
  let outerElement = document.getElementById(DEVTOOLS_ID);
  if (!outerElement?.isConnected) {
    outerElement = document.createElement('div');
    outerElement.id = DEVTOOLS_ID;
    outerElement.style.height = '0px';
    outerElement.style.overflow = 'hidden';
    document.body.appendChild(outerElement);
  }

  let shadowRoot = outerElement.shadowRoot;
  if (!shadowRoot) {
    outerElement.attachShadow({ mode: 'open' });
    shadowRoot = outerElement.shadowRoot;
  }

  let rootElement = shadowRoot.firstElementChild;

  if (!rootElement) {
    rootElement = document.createElement('div');
    shadowRoot.appendChild(rootElement);
  }
  return rootElement as HTMLElement;
}
