import * as umd from '../../node_modules/@tolgee/core/dist/tolgee.umd';
import * as commonjs from '../../node_modules/@tolgee/core/dist/tolgee.cjs';
import { TextObserver, ContextUi } from '@tolgee/devtools-web';
import { BackendPlugin } from '@tolgee/backend-fetch';

[umd, commonjs].forEach((bundle) => {
  const bundleDivElement = document.createElement('div');

  const tolgee = bundle
    .Tolgee()
    .use(BackendPlugin({ prefix: 'i18n' }))
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
