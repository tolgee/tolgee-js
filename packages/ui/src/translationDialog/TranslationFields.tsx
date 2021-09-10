import * as React from 'react';
import { FunctionComponent, useContext } from 'react';
import { useWithStyles } from '../common/styles/useWithStyles';
import { TranslationDialogContext } from './TranslationDialogContextProvider';

export const TranslationFields: FunctionComponent = () => {
  const context = useContext(TranslationDialogContext);

  const style: React.CSSProperties = {
    margin: '10px 0 0 0',
    padding: '5px',
    border: '1px solid #ccc',
    width: '100%',
    borderRadius: '5px',
    fontStyle: 'inherit',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    display: 'block',
  };

  useWithStyles(`
        .tolgee-translation-input-loading{
            background: linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.1), rgba(0,0,0,0), rgba(0,0,0,0));
            background-size: 500% 500%;
            animation: tolgee-translation-input-loading 1.5s linear infinite alternate;
        }
        
        @keyframes tolgee-translation-input-loading {
            0%   {background-position: 0%;}
            100% {background-position: 100%;}
        }        
    `);

  const LoadingTextArea = () => (
    <div
      className="tolgee-translation-input-loading"
      style={{
        ...style,
        height: '42px',
      }}
    />
  );

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
        Object.keys(context.translations.translations).map((key) => (
          <textarea
            style={style}
            disabled={context.editDisabled}
            key={key}
            lang={key}
            placeholder={key}
            value={context.translations.translations[key]}
            onChange={context.onTranslationInputChange(key)}
          />
        ))
      )}
    </>
  );
};
