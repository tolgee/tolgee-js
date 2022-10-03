import * as umd from '../../node_modules/@tolgee/web/dist/tolgee-web.umd';
import * as commonjs from '../../node_modules/@tolgee/web/dist/tolgee-web.cjs';
import { TextObserver, ContextUi, BackendFetch } from '@tolgee/web';

[umd, commonjs].forEach((bundle) => {
  const bundleDivElement = document.createElement('div');

  const tolgee = bundle
    .Tolgee()
    .use(BackendFetch({ prefix: 'i18n' }))
    .use(TextObserver())
    .use(ContextUi())
    .init({
      defaultLanguage: 'en',
      targetElement: bundleDivElement,
    });

  bundleDivElement.setAttribute('id', bundle);

  document.body.append(bundleDivElement);

  const htmlParagraphElement = document.createElement('p');

  bundleDivElement.append(htmlParagraphElement);

  tolgee.run().then(() => {
    const translation = tolgee.t('test');
    htmlParagraphElement.append(translation);
    bundleDivElement.append('%-%tolgee:test%-%');
  });
});
