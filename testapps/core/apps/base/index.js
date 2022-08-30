import { Tolgee, InvisibleObserver, TextObserver } from '@tolgee/core';

const tolgee = Tolgee()
  .setObserver(InvisibleObserver())
  .init({
    staticData: {
      en: { hello: 'world', title: 'Title' },
      es: { hello: 'world' },
    },
  });

const test1 = document.createElement('div');
test1.textContent = 'test1';
const test2 = document.createElement('div');
test2.textContent = 'test2';

document.body.append(test1);
document.body.append(test2);

tolgee.run().then(() => {
  test1.childNodes[0].nodeValue = tolgee.instant('hello');
  test1.setAttribute('fucker', tolgee.instant('title'));

  test2.innerHTML = `<span>${tolgee.instant('hello')}</span>`;
});
