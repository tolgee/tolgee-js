import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { T, useTranslate } from '@tolgee/react';
import { ChooseLanguage } from './ChooseLanguage';
import { Dialog, DialogContent } from '@mui/material';

export const Page: FunctionComponent = () => {
  const [disappeared, setDisappeared] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const t = useTranslate();

  function disappear() {
    setDisappeared(true);
  }

  return (
    <div>
      <ChooseLanguage />
      <h1>
        <T>sampleApp.hello_world!</T>
      </h1>
      <h1>
        <T>just_english</T>
      </h1>
      {!disappeared && (
        <button onClick={() => disappear()}>
          <T>disappears_on_click</T>
        </button>
      )}

      <div>
        <button onClick={() => setDialogOpen(true)}>
          <T>open_dialog</T>
        </button>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent>
          <T strategy="TEXT_WRAP">text_in_dialog</T>
          <T strategy="TEXT_WRAP">text_in_dialog2</T>
        </DialogContent>
      </Dialog>

      <div title={t('sampleApp.hello_world!')}>
        <h3>Div with title</h3>
      </div>

      <div aria-label={t('sampleApp.hello_world!')}>
        <h3>Div with aria label</h3>
      </div>

      <div>
        <h3>Deprecated noWrap prop:</h3>
        <T noWrap>sampleApp.hello_world!</T>
      </div>

      <div>
        <h3>TEXT_WRAP strategy</h3>
        <T strategy="TEXT_WRAP">sampleApp.hello_world!</T>
      </div>

      <div>
        <h3>NO_WRAP strategy</h3>
        <T strategy="NO_WRAP">sampleApp.hello_world!</T>
      </div>

      <div>
        <h3>ELEMENT_WRAP strategy</h3>
        <T
          strategy="ELEMENT_WRAP"
          parameters={{ name: `<img onerror='alert("hou")'/>` }}
        >
          sampleApp.hello_world!
        </T>
      </div>

      <div>
        <h3>Default value</h3>
        <T strategy="ELEMENT_WRAP" keyName="unknown key">
          This is default!
        </T>
      </div>

      <div>
        <h3>Key is default value</h3>
        <T strategy="ELEMENT_WRAP">unknown key</T>
      </div>

      <div>
        {t('hey', undefined, true)}
        {t('hey', undefined, false)}
      </div>
    </div>
  );
};
