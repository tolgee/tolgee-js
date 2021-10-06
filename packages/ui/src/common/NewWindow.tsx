import React, { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslationDialogContext } from '../KeyDialog/useTranslationDialogContext';
import { StylesContextProvider } from './styles/StylesContextProvider';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

export const NewWindow: FC = (props) => {
  const newWindow = useRef(null);
  const { container, setContainer, onClose } = useTranslationDialogContext();
  const [popup, setPopup] = useState<Window>(null);

  useEffect(() => {
    // Create container element on client-side
    const div = document.createElement('div');
    div.style.width = '100vw';
    div.style.height = '100vh';
    div.style.position = 'relative';
    setContainer(div);
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
      win.document.body.style.margin = '0px';
      win.document.body.appendChild(container);

      const onExit = () => {
        setContainer(null);
        win.close();
        onClose();
      };

      win.onbeforeunload = () => {
        setContainer(null);
        onClose();
      };

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
      setPopup(win);

      return () => {
        win.document.removeEventListener('keydown', onKeyDown, true);
        window.removeEventListener('beforeunload', onBeforeUnload, true);
        setContainer(null);
        newWindow.current.close();
        setPopup(null);
      };
    }
  }, [container]);

  const styleCache = React.useMemo(() => {
    // styles insertion point in popup head
    const head = popup?.document.head;
    return createCache({
      key: 'external',
      container: head,
    });
  }, [popup]);

  return container
    ? createPortal(
        <StylesContextProvider
          insertionPoint={
            container.ownerDocument.getElementsByTagName('head')[0]
          }
        >
          <CacheProvider value={styleCache}>{props.children}</CacheProvider>
        </StylesContextProvider>,
        container
      )
    : null;
};
