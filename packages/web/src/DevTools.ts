import { InContextTools } from './InContextTools';
import { BrowserExtensionPlugin } from './typedIndex';

let DevTools: typeof InContextTools;

if (process.env.NODE_ENV !== 'production') {
  DevTools = InContextTools;
} else {
  DevTools = BrowserExtensionPlugin;
}

export { DevTools };
