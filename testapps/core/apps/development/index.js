import { Tolgee } from '@tolgee/core';

const HOST = 'localhost';
const PORT = 8202;

const tolgee = new Tolgee({
  watch: true,
  targetElement: document.body,
  apiUrl: 'http://' + HOST + ':' + PORT,
  apiKey: 'this_is_dummy_api_key',
  highlightColor: 'yellow',
});

tolgee.translate('sampleApp.english_text_one').then((t) => {
  const htmlElement = document.createElement('div');
  document.body.append(htmlElement);
  htmlElement.append(t);
});
tolgee.translate('sampleApp.hello_world!').then((t) => {
  const select = document.createElement('select');
  const option = document.createElement('option');
  const option2 = document.createElement('option');
  select.append(option);
  select.append(option2);
  option.innerHTML = t;
  option2.innerHTML = 'Not translated';
  document.body.append(select);
});

tolgee.run();
