import { VueTolgee } from '@tolgee/vue';
import { createTolgee } from '../tolgee';

export const onCreateApp = (pageContext) => {
  const { app, lang } = pageContext;
  const tolgee = createTolgee(lang);

  app.use(VueTolgee, { tolgee });
};
