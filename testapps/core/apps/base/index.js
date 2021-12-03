import * as umd from '../../node_modules/@tolgee/core/dist/tolgee.umd';
import * as commonjs from '../../node_modules/@tolgee/core/dist/tolgee.cjs';
import { IcuFormatter } from '@tolgee/core';

[umd, commonjs].forEach((bundle) => {
  const bundleDivElement = document.createElement('div');

  const tolgee = new bundle.Tolgee.use(IcuFormatter).init({
    watch: true,
    targetElement: bundleDivElement,
  });

  bundleDivElement.setAttribute('id', bundle);

  document.body.append(bundleDivElement);

  const htmlParagraphElement = document.createElement('p');

  bundleDivElement.append(htmlParagraphElement);

  tolgee.run().then(() => {
    tolgee.translate('test').then((t) => {
      htmlParagraphElement.append(t);
      bundleDivElement.append('%-%tolgee:test%-%');
    });
  });
});
