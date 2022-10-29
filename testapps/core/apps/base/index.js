import * as umd from '../../node_modules/@tolgee/web/dist/tolgee-web.main.umd';
import * as commonjs from '../../node_modules/@tolgee/web/dist/tolgee-web.main.cjs';
import {
  TextObserver,
  ContextUi,
  BackendFetch,
  InContextTools,
} from '@tolgee/web';

[umd, commonjs].forEach((bundle) => {
  const bundleDivElement = document.createElement('div');

  const tolgee = bundle
    .Tolgee()
    .use(InContextTools({ type: 'text' }))
    .use(BackendFetch({ prefix: 'i18n' }))
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
