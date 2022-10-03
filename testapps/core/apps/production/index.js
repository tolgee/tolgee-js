import { Tolgee, TextObserver, BackendFetch } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';

document.body = document.createElement('body');
const htmlElement = document.createElement('div');
document.body.append(htmlElement);

const initialTextsToTranslate = document.createElement('div');
initialTextsToTranslate.innerHTML =
  '<p>{{test}}</p><p>{{test}}</p><p>{{test_param:param:value}}</p><p>{{test}}</p><p>{{this_is_mentioned_just_in_english}}</p>';
document.body.append(initialTextsToTranslate);

const tolgee = Tolgee()
  .use(
    TextObserver({
      inputPrefix: '{{',
      inputSuffix: '}}',
    })
  )
  .use(FormatIcu())
  .use(BackendFetch({ prefix: 'i18n' }))
  .init({
    currentLanguage: 'cs',
    fallbackLanguage: 'en',
  });
tolgee.changeLanguage('cs');
tolgee.on('keyUpdate', () => {
  refresh();
});

const refresh = () => {
  const translation = tolgee.t('test');
  htmlElement.innerHTML = '';
  htmlElement.append(translation);
  const p = document.createElement('p');
  window.setLang = (lang) => tolgee.changeLanguage(lang);
  p.innerHTML =
    '<button onclick=\'window.setLang("cs")\'>cs</button>' +
    '<button onclick=\'window.setLang("en")\'>en</button>';

  htmlElement.append(p);
};

tolgee.run().then(refresh);
