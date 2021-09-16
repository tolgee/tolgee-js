import React from 'react';
import { RESTRICTED_ASCENDANT_ATTRIBUTE } from '@tolgee/core/lib/Constants/Global';
import { TextHelper } from '@tolgee/core/lib/helpers/TextHelper';

import { useTranslationDialogContext } from './useTranslationDialogContext';
import { IconButton } from './IconButton';
import { TranslationFields } from './TranslationFields';
import { OpenInNew } from '../common/icons';
import { LanguageSelect } from '../LanguageSelect';
import { Button } from '../common/Button';

export const KeyForm = () => {
  const handleTakeScreenshot = () => {
    context.handleTakeScreenshot('asdf');
  };

  const context = useTranslationDialogContext();

  return (
    <div
      style={{
        fontFamily: 'Rubik, Roboto, Arial',
        padding: 10,
        boxSizing: 'border-box',
        maxWidth: '100%',
      }}
      {...{ [RESTRICTED_ASCENDANT_ATTRIBUTE]: 'true' }}
    >
      <div style={{ display: 'flex' }}>
        <div>
          <h3 style={{ marginTop: 0 }}>Translate text</h3>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexGrow: 1,
          }}
        >
          <span>
            {!context.useBrowserWindow && (
              <IconButton
                title="Open in new window"
                onClick={() => context.setUseBrowserWindow(true)}
              >
                <OpenInNew />
              </IconButton>
            )}
          </span>
        </div>
      </div>
      <p style={{ marginTop: 0, marginBottom: '20px' }}>
        {context.input && TextHelper.removeEscapes(context.input)}
        <span style={{ color: 'grey' }}>
          {!context.translations?.id && " (key doesn't exist yet)"}
        </span>
      </p>
      <LanguageSelect />

      <div style={{ marginTop: '20px' }}>
        <TranslationFields />
      </div>
      {context.editDisabled && !context.loading && (
        <>
          "Modification is restricted due to missing translations.edit scope in
          current api key settings."
        </>
      )}

      {context.error && <div style={{ color: 'red' }}>{context.error}</div>}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <Button onClick={context.onClose} color="default">
          Cancel
        </Button>
        <div style={{ display: 'flex' }}>
          {context.pluginAvailable && (
            <Button
              onClick={() => handleTakeScreenshot()}
              style={{ marginLeft: '10px' }}
            >
              Take screenshot
            </Button>
          )}

          <Button
            disabled={context.saving || context.editDisabled}
            onClick={context.onSave}
            color="primary"
            style={{ marginLeft: '10px' }}
          >
            {context.success
              ? 'Saved! ✓'
              : context.saving
              ? 'Saving...'
              : !context.translations?.id
              ? 'Create'
              : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  );
};
