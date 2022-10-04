import { TolgeePlugin, DevTools } from '@tolgee/web';

export const VuePlugin = (): TolgeePlugin => (tolgee) => tolgee.use(DevTools());
