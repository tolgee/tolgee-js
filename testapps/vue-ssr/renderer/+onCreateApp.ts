import { VueTolgee } from '@tolgee/vue';
import { createTolgee } from '../tolgee';

export const onCreateApp = (pageContext) => {
  const { app } = pageContext;
  const tolgee = createTolgee();

  app.use(VueTolgee, { tolgee, enableSSR: true });
};
