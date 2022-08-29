import { InvisibleWrapper, Tolgee, InvisibleObserver } from '@tolgee/core';

const bundleDivElement = document.createElement('div');

const tolgee = Tolgee()
  .setObserver(InvisibleObserver())
  .init({
    targetElement: bundleDivElement,
    staticData: {
      en: { hello: 'world', title: 'Title' },
      es: { hello: 'world' },
    },
  });

bundleDivElement.setAttribute('id', 'test');

document.body.append(bundleDivElement);

const htmlParagraphElement = document.createElement('p');
htmlParagraphElement.textContent = 'hello';

bundleDivElement.append(htmlParagraphElement);

tolgee.run().then(() => {
  htmlParagraphElement.childNodes[0].nodeValue = tolgee.instant('hello');
  htmlParagraphElement.setAttribute('title', tolgee.instant('title'));
});
