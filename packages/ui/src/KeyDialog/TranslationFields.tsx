import React from 'react';
import { FunctionComponent } from 'react';
import {
  useDialogContext,
  useDialogDispatch,
} from './TranslationDialogContextProvider';
import { styled, TextField } from '@mui/material';
import { keyframes } from '@mui/styled-engine';
import { ScFieldTitle } from '../common/FieldTitle';
import { languageIsPermitted } from 'tools/languageIsPermitted';

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
  const dispatch = useDialogDispatch();

  const selectedLanguages = useDialogContext((c) => c.selectedLanguages);
  const availableLanguages = useDialogContext((c) => c.availableLanguages);
  const translationsForm = useDialogContext((c) => c.translationsForm);
  const formDisabled = useDialogContext((c) => c.formDisabled);
  const loading = useDialogContext((c) => c.loading);
  const properties = useDialogContext((c) => c.dependencies.properties);

  const onChange = (key: string) => (e: any) => {
    dispatch({
      type: 'ON_INPUT_CHANGE',
      payload: { key, value: e.target.value },
    });
  };

  const Loading = () => (
    <>
      {selectedLanguages ? (
        [...selectedLanguages].map((lang) => <LoadingTextArea key={lang} />)
      ) : (
        <LoadingTextArea />
      )}
    </>
  );

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        [...selectedLanguages].map((key) => {
          const lang = availableLanguages?.find((l) => l.tag === key);
          const languageAuthorized = languageIsPermitted(
            properties.permittedLanguages,
            key
          );

          return (
            <React.Fragment key={key}>
              <ScFieldTitle>{lang?.name || key}</ScFieldTitle>
              <ScTextField
                size="small"
                disabled={formDisabled || !languageAuthorized}
                key={key}
                inputProps={{
                  lang: key,
                }}
                minRows={2}
                maxRows={Infinity}
                multiline
                fullWidth
                value={translationsForm[key] || ''}
                onChange={onChange(key)}
              />
            </React.Fragment>
          );
        })
      )}
    </>
  );
};
