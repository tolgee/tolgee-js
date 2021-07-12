export const createTestDom = (document: Document) => {
  const c = {
    keyInRoot: 'key_in_root',
    keyInRootDiv: 'aaa_translate_Key.aaa',
    hereKey: 'here',
    hereTooKey: 'here_too',
    appendedKey: 'appended_key',
    ariaLabelKey: 'aria_label_key',
    optionKey: 'option_key',
  };

  document.body = document.createElement('body');
  document.body.innerHTML = `{{${c.keyInRoot}}}' +
        '<div id="rootDiv">Some trash... {{${c.keyInRootDiv}}}' +
        '   <div>Some other text to translate <span>{{${c.hereKey}}} and {{${c.hereTooKey}}}</span> text continues.'</div> +
        '   <div id="multipleTextNodes">Before text</div>' +
        '   <div aria-label="this is {{${c.ariaLabelKey}}} label"></div>' +
        '   <select><option>{{${c.optionKey}}}</option></select>'+
        '<div>`;
  document.getElementById('multipleTextNodes').append('some text node');
  document.getElementById('multipleTextNodes').append(`{{${c.appendedKey}}}`);
  document.getElementById('multipleTextNodes').append(` after text`);

  return c;
};
