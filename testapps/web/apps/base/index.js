import * as umd from '../../node_modules/@tolgee/web/dist/tolgee-web.development.umd';
import * as commonjs from '../../node_modules/@tolgee/web/dist/tolgee-web.development.cjs';

[umd, commonjs].forEach((bundle) => {
  const bundleDivElement = document.createElement('div');

  const tolgee = bundle
    .Tolgee()
    .use(bundle.DevTools())
    .use(bundle.BackendFetch({ prefix: 'i18n' }))
    .init({
      defaultLanguage: 'en',
      observerType: 'text',
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
