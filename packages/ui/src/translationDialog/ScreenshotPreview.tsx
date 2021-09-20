import React, { useContext, useState } from 'react';
import { RESTRICTED_ASCENDANT_ATTRIBUTE } from '@tolgee/core/lib/Constants/Global';

import { Button } from '../common/Button';
import { TranslationDialogContext } from './TranslationDialogContextProvider';
import { sleep } from '../tools/sleep';

export const ScreenshotPreview = () => {
  const context = useContext(TranslationDialogContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>();

  const handleClose = () => {
    context.removeLastScreenshot();
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      await context.onScreenshotUpload();
      setSuccess(true);
      await sleep(200);
      context.removeLastScreenshot();
    } catch (e) {
      setLoading(false);
      setSuccess(false);
      setError(e.message);
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Rubik, Roboto, Arial',
        padding: 10,
        boxSizing: 'border-box',
        position: 'relative',
        display: 'grid',
        width: '100%',
        height: '100%',
        gridTemplateRows: 'auto 1fr auto auto',
        overflow: 'hidden',
      }}
      {...{ [RESTRICTED_ASCENDANT_ATTRIBUTE]: 'true' }}
    >
      <div>
        <h3 style={{ marginTop: 0 }}>Captured screenshot</h3>
      </div>

      <div
        style={{
          position: 'relative',
          justifySelf: 'stretch',
          alignSelf: 'stretch',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          background: '#f3f3f3',
        }}
      >
        <img
          src={context.lastScreenshot}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            padding: 2,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '8px',
        }}
      >
        <Button onClick={handleClose}>Discard</Button>
        <Button color="primary" disabled={loading} onClick={handleUpload}>
          {success
            ? 'Done! ✓'
            : loading
            ? 'Uploading...'
            : !context.translations?.id
            ? 'Create key & Upload'
            : 'Upload'}
        </Button>
      </div>
    </div>
  );
};
