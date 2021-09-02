import { FC, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslationDialogContext } from '../translationDialog/useTranslationDialogContext';
import { StylesContextProvider } from './styles/StylesContextProvider';
import React = require('react');

export const NewWindow: FC = (props) => {
  const newWindow = useRef(null);
  const { container, setContainer, onClose } = useTranslationDialogContext();
  useEffect(() => {
    // Create container element on client-side
    setContainer(document.createElement('div'));
  }, []);

  useEffect(() => {
    // When container is ready
    if (container) {
      // Create window
      const win = window.open('', '', 'width=600,height=400,left=200,top=200');
      win.document.title = 'Tolgee - Translate Text';
      if (!win.document) {
        alert('Please allow popups to open new window.');
      }
      newWindow.current = win;
      // Append container
      win.document.body.appendChild(container);

      const onExit = () => {
        setContainer(null);
        win.close();
        onClose();
      };

      win.addEventListener('close', () => {
        setContainer(null);
      });

      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          onExit();
        }
      };

      const onBeforeUnload = () => {
        onExit();
      };

      win.document.addEventListener('keydown', onKeyDown, true);
      window.addEventListener('beforeunload', onBeforeUnload, true);

      return () => {
        win.document.removeEventListener('keydown', onKeyDown, true);
        window.removeEventListener('beforeunload', onBeforeUnload, true);
        setContainer(null);
        newWindow.current.close();
      };
    }
  }, [container]);

  return container
    ? createPortal(
        <StylesContextProvider
          insertionPoint={
            container.ownerDocument.getElementsByTagName('head')[0]
          }
        >
          {props.children}
        </StylesContextProvider>,
        container
      )
    : null;
};
