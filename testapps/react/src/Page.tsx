import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { T } from '@tolgee/react';
import { ChooseLanguage } from './ChooseLanguage';
import { Dialog, DialogContent } from '@material-ui/core';

export const Page: FunctionComponent = () => {
  const [disappeared, setDisappeared] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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
          <T>text_in_dialog</T>
          <T>text_in_dialog2</T>
        </DialogContent>
      </Dialog>
      <T>!??!&? sdůlaksd</T>
    </div>
  );
};
