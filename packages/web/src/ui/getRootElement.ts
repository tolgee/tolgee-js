import { DEVTOOLS_ID } from '../constants';

export function getRootElement() {
  let rootElement = document.getElementById(DEVTOOLS_ID);
  if (!rootElement?.isConnected) {
    rootElement = document.createElement('div');
    rootElement.id = DEVTOOLS_ID;
    rootElement.attachShadow({ mode: 'open' });
    document.body.appendChild(rootElement);
  }
  return rootElement.shadowRoot!;
}
