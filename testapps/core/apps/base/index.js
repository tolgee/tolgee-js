import { InvisibleWrapper, Tolgee, InvisibleObserver } from '@tolgee/core';

const bundleDivElement = document.createElement('div');

const tolgee = Tolgee({
  targetElement: bundleDivElement,
  staticData: {
    en: { hello: 'world' },
    es: { hellow: 'world' },
  },
})
  .setWrapper(InvisibleWrapper)
  .setObserver(InvisibleObserver);

bundleDivElement.setAttribute('id', 'test');

document.body.append(bundleDivElement);

const htmlParagraphElement = document.createElement('p');
htmlParagraphElement.textContent = 'hello';

bundleDivElement.append(htmlParagraphElement);

tolgee.run().then(() => {
  console.log('here');
  htmlParagraphElement.childNodes[0].nodeValue = tolgee.instant('hello');
});
