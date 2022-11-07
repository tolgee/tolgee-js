import { InContextTools } from './InContextTools';

let DevTools: typeof InContextTools;

if (process.env.NODE_ENV !== 'production') {
  DevTools = InContextTools;
} else {
  DevTools = () => (tolgee) => tolgee;
}

export { DevTools };
