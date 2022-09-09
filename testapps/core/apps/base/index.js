import { Tolgee } from '@tolgee/core';
import { TextObserver, UI } from '@tolgee/devtools-web';
import { IcuPlugin } from '@tolgee/icu-formatter';

const tolgee = Tolgee()
  .setObserver(TextObserver())
  .setUi(UI)
  .use(IcuPlugin())
  .init({
    ns: ['', 'ns'],
    staticData: {
      en: { world: 'World', title: 'Title' },
      'en:ns': () => import('./en').then((data) => data.default),
      es: { world: 'Mundo', title: 'Titlo' },
      'es:ns': () => import('./es').then((data) => data.default),
    },
  });

const languageSelect = document.createElement('select');
languageSelect.innerHTML = `
  <option value="en" default>en</option>
  <option value="es">es</option>
`;
languageSelect.onchange = (e) => {
  tolgee.changeLanguage(e.target.value);
};

const test1 = document.createElement('div');
test1.textContent = 'test1';
const test2 = document.createElement('div');
const test3 = document.createElement('div');
const test4 = document.createElement('div');

document.body.append(languageSelect);
document.body.append(test1);
document.body.append(test2);
document.body.append(test3);
document.body.append(test4);

tolgee.run().then(() => {
  test1.childNodes[0].nodeValue = tolgee.t({
    key: 'world',
    params: { name: 'user' },
  });
  test1.setAttribute('title', tolgee.t({ key: 'title' }));

  test2.innerHTML = `<span>${tolgee.t({
    key: 'world',
    params: { name: 'user' },
  })}</span>`;

  test3.innerHTML = `<span><span>${tolgee.t({
    key: 'world',
    params: { name: 'idiot' },
  })}</span><span>${tolgee.t({ key: 'title' })}</span></span>`;

  test4.innerHTML = `<span>${tolgee.t({
    key: 'world',
    ns: 'ns',
  })}</span>`;
});
