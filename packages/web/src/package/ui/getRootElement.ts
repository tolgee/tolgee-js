import { DEVTOOLS_ID } from '../constants';

export function getRootElement() {
  let rootElement = document.getElementById(DEVTOOLS_ID);
  if (!rootElement?.isConnected) {
    rootElement = document.createElement('div');
    rootElement.id = DEVTOOLS_ID;
    rootElement.style.height = '0px';
    rootElement.style.overflow = 'hidden';
    document.body.appendChild(rootElement);
  }

  if (!rootElement.shadowRoot) {
    rootElement.attachShadow({ mode: 'open' });
  }
  return rootElement.shadowRoot!;
}
