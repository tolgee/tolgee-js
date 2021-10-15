import React from 'react';
import { RESTRICTED_ASCENDANT_ATTRIBUTE } from '@tolgee/core/lib/Constants/Global';
import { TextHelper } from '@tolgee/core/lib/helpers/TextHelper';
import { styled, IconButton, Button } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

import { useTranslationDialogContext } from './useTranslationDialogContext';
import { TranslationFields } from './TranslationFields';
import { LanguageSelect } from './LanguageSelect';
import { LoadingButton } from '../common/LoadingButton';
import { ScreenshotGallery } from './ScreenshotGallery/ScreenshotGallery';
import { ScFieldTitle } from '../common/FieldTitle';

const ScContainer = styled('div')`
  font-family: Rubik, Roboto, Arial;
  padding: 20px;
  box-sizing: border-box;
  max-width: 100%;
  width: 700px;
  display: flex;
  flex-direction: column;
`;

const ScHeading = styled('div')`
  display: flex;
  align-items: center;
`;

const ScHeadingTitle = styled('div')`
  display: flex;
  margin: 0px;
  margin-right: 5px;
  font-size: 19px;
`;

const ScHeadingRight = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
`;

const ScKey = styled('p')`
  margin: 0px;
`;

const ScKeyHint = styled('span')`
  color: grey;
`;

const ScFieldsWrapper = styled('div')`
  margin-top: 20px;
`;

const ScGalleryWrapper = styled('div')`
  margin-top: 10px;
`;

const ScControls = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  min-height: 36px;
`;

const ScRestriction = styled('div')`
  margin-top: 8px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const ScError = styled('div')`
  color: red;
`;

export const KeyForm = () => {
  const context = useTranslationDialogContext();
  const screenshotsView =
    context.dependencies.coreService.isAuthorizedTo('screenshots.view');

  return (
    <ScContainer {...{ [RESTRICTED_ASCENDANT_ATTRIBUTE]: 'true' }}>
      <ScHeading>
        <ScHeadingTitle>Quick translation</ScHeadingTitle>

        {!context.useBrowserWindow && (
          <IconButton
            title="Open in new window"
            onClick={() => context.setUseBrowserWindow(true)}
            color="inherit"
            size="small"
          >
            <OpenInNew fontSize="small" />
          </IconButton>
        )}

        <ScHeadingRight>
          <LanguageSelect />
        </ScHeadingRight>
      </ScHeading>

      <ScFieldTitle>Key</ScFieldTitle>
      <ScKey>
        {context.input && TextHelper.removeEscapes(context.input)}
        <ScKeyHint>
          {context.translations?.keyId === undefined &&
            " (key doesn't exist yet)"}
        </ScKeyHint>
      </ScKey>

      <ScFieldsWrapper>
        <TranslationFields />
      </ScFieldsWrapper>

      {screenshotsView && (
        <ScGalleryWrapper>
          <ScreenshotGallery />
        </ScGalleryWrapper>
      )}

      {context.formDisabled && !context.loading && (
        <ScRestriction>{`Modification is restricted due to missing ${
          context.translations?.keyId !== undefined
            ? 'translations.edit'
            : 'keys.edit'
        } scope in current api key settings.`}</ScRestriction>
      )}

      {context.error && <ScError>{context.error}</ScError>}
      <ScControls>
        <Button onClick={context.onClose} color="secondary">
          Cancel
        </Button>
        <LoadingButton
          loading={context.saving}
          disabled={context.saving || context.formDisabled}
          onClick={context.onSave}
          color="primary"
          variant="contained"
          style={{ marginLeft: '10px' }}
        >
          {context.success
            ? 'Saved! ✓'
            : context.translations?.keyId === undefined
            ? 'Create'
            : 'Update'}
        </LoadingButton>
      </ScControls>
    </ScContainer>
  );
};
