import { Tolgee, DevTools, BackendFetch } from '@tolgee/web';

const bundleDivElement = document.createElement('div');

const tolgee = Tolgee()
  .use(DevTools())
  .use(BackendFetch({ prefix: 'i18n' }))
  .init({
    defaultLanguage: 'en',
    observerType: 'text',
  });

document.body.append(bundleDivElement);

const htmlParagraphElement = document.createElement('p');

bundleDivElement.append(htmlParagraphElement);

tolgee.run().then(() => {
  const translation = tolgee.t('test');
  htmlParagraphElement.append(translation);
  bundleDivElement.append('%-%tolgee:test%-%');
});
