import React from 'react';
import { FunctionComponent, useContext } from 'react';
import { TranslationDialogContext } from './TranslationDialogContextProvider';
import { styled, TextField } from '@mui/material';
import { keyframes } from '@mui/styled-engine';
import { ScFieldTitle } from '../common/FieldTitle';

const inputLoading = keyframes`
  0%   { background-position: 0%; }
  100% { background-position: 100%; }
`;

const ScTextField = styled(TextField)`
  margin: 0px;
  & .Mui-disabled {
    background: ${({ theme }) => theme.palette.grey[200]};
  }
`;

const LoadingTextArea = styled('div')`
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  width: 100%;
  border-radius: 5px;
  font-style: inherit;
  font-family: inherit;
  box-sizing: border-box;
  display: block;
  height: 42px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0)
  );
  background-size: 500% 500%;
  animation: ${inputLoading} 1.5s linear infinite alternate;
`;

export const TranslationFields: FunctionComponent = () => {
  const context = useContext(TranslationDialogContext);

  const Loading = () => (
    <>
      {context.selectedLanguages ? (
        [...context.selectedLanguages].map((lang) => (
          <LoadingTextArea key={lang} />
        ))
      ) : (
        <LoadingTextArea />
      )}
    </>
  );

  return (
    <>
      {context.loading ? (
        <Loading />
      ) : (
        [...context.selectedLanguages].map((key) => {
          const lang = context.availableLanguages?.find((l) => l.tag === key);

          return (
            <React.Fragment key={key}>
              <ScFieldTitle>{lang?.name || key}</ScFieldTitle>
              <ScTextField
                size="small"
                disabled={context.formDisabled}
                key={key}
                lang={key}
                minRows={2}
                maxRows={Infinity}
                multiline
                fullWidth
                value={context.translationsForm[key] || ''}
                onChange={context.onTranslationInputChange(key)}
              />
            </React.Fragment>
          );
        })
      )}
    </>
  );
};
