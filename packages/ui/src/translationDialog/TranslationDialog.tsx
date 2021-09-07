import * as React from 'react';
import { LanguageSelect } from '../LanguageSelect';
import { TranslationFields } from './TranslationFields';
import { Button } from '../common/Button';
import { TranslationDialogWrapper } from './TranslationDialogWrapper';
import { TextHelper } from '@tolgee/core/lib/helpers/TextHelper';
import { useTranslationDialogContext } from './useTranslationDialogContext';
import { OpenInNew } from '../common/icons';
import { IconButton } from './IconButton';
import { RESTRICTED_ASCENDANT_ATTRIBUTE } from '@tolgee/core/lib/Constants/Global';

export const TranslationDialog = () => {
  const context = useTranslationDialogContext();

  return (
    <TranslationDialogWrapper context={context}>
      <div
        style={{ fontFamily: 'Rubik, Roboto, Arial' }}
        {...{ [RESTRICTED_ASCENDANT_ATTRIBUTE]: 'true' }}
      >
        <div style={{ display: 'flex' }}>
          <div>
            <h3 style={{ marginTop: 0 }}>Translate text</h3>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}
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
        </p>
        <LanguageSelect />

        <div style={{ marginTop: '20px' }}>
          <TranslationFields />
        </div>
        {context.editDisabled && !context.loading && (
          <>
            "Modification is restricted due to missing translations.edit scope
            in current api key settings."
          </>
        )}

        {context.error && <div style={{ color: 'red' }}>{context.error}</div>}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '10px',
          }}
        >
          <Button onClick={context.onClose} color="default">
            Cancel
          </Button>
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
              : 'Save'}
          </Button>
        </div>
      </div>
    </TranslationDialogWrapper>
  );
};
