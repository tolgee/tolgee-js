import { Tolgee, TextObserver, TolgeeBackend } from '@tolgee/core';
import { UI } from '@tolgee/ui';

const tolgee = Tolgee()
  .setObserver(TextObserver())
  .setUi(UI)
  .addBackend(TolgeeBackend)
  .init({
    apiKey: 'tgpak_he3tmx3oovyhizdgm5vwkmrzoq2xemdjmu2gg5dfoe2wmm3h',
    apiUrl: 'https://testing.tolgee.io',
    staticData: {
      en: { world: 'World', title: 'Title' },
      'en:ns': { world: 'NSWorld' },
      es: { world: 'Mundo' },
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

tolgee.run();

test1.childNodes[0].nodeValue = tolgee.instant({ key: 'world' });
test1.setAttribute('title', tolgee.instant({ key: 'title' }));

test2.innerHTML = `<span>${tolgee.instant({ key: 'world' })}</span>`;

test3.innerHTML = `<span><span>${tolgee.instant({
  key: 'world',
})}</span><span>${tolgee.instant({ key: 'title' })}</span></span>`;

test4.innerHTML = `<span>${tolgee.instant({ key: 'world', ns: 'ns' })}</span>`;

console.log(tolgee.instant({ key: 'world', ns: 'ns' }));
