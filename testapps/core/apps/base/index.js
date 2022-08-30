import { Tolgee, TextObserver } from '@tolgee/core';

const delayedPromise = (data) => () =>
  new Promise((resolve) => setTimeout(() => resolve(data), 100));

const tolgee = Tolgee()
  .setObserver(TextObserver())
  .init({
    staticData: {
      en: delayedPromise({ world: 'World', title: 'Title' }),
      es: delayedPromise({ world: 'Mundo' }),
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

document.body.append(languageSelect);
document.body.append(test1);
document.body.append(test2);
document.body.append(test3);

tolgee.run().then(() => {
  test1.childNodes[0].nodeValue = tolgee.instant('world');
  test1.setAttribute('title', tolgee.instant('title'));

  test2.innerHTML = `<span>${tolgee.instant('world')}</span>`;

  test3.innerHTML = `<span><span>${tolgee.instant(
    'world'
  )}</span><span>${tolgee.instant('title')}</span></span>`;
});
