import { Tolgee, BackendFetch, LanguageStorage } from '@tolgee/web';

const tolgee = Tolgee()
  .use(BackendFetch({ prefix: 'i18n' }))
  .use(LanguageStorage())
  .init({
    targetElement: document.body,
    highlightColor: 'yellow',
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
  });

tolgee.on('language', () => {
  refresh();
});

const refresh = () => {
  const translation = tolgee.t('test');
  document.body = document.createElement('body');
  const htmlElement = document.createElement('div');
  document.body.append(htmlElement);
  htmlElement.append(translation);
  const p = document.createElement('p');
  window.setLang = () => tolgee.changeLanguage('cs');
  p.innerHTML = `<button onclick='window.setLang()'>cs</button>`;
  document.body.append(p);
  const elementWithInstant = document.createElement('p');
  elementWithInstant.innerText = tolgee.t('this_is_mentioned_just_in_english');
  document.body.append(elementWithInstant);
};

tolgee.run().then(refresh);
