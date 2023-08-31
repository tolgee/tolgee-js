import { DEVTOOLS_ID } from '../constants';

export function getRootElement() {
  let rootElement = document.getElementById(DEVTOOLS_ID);
  if (!rootElement?.isConnected) {
    rootElement = document.createElement('div');
    rootElement.id = DEVTOOLS_ID;
    rootElement.attachShadow({ mode: 'open' });
    rootElement.style.height = '0px';
    rootElement.style.overflow = 'hidden';
    document.body.appendChild(rootElement);
  }
  return rootElement.shadowRoot!;
}
