import React, { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import {
  useDialogContext,
  useDialogDispatch,
} from './TranslationDialogContextProvider';

export const NewWindow: FC = (props) => {
  const newWindow = useRef(null);
  const [popup, setPopup] = useState<Window>(null);
  const dispatch = useDialogDispatch();
  const container = useDialogContext((c) => c.container);

  const setContainer = (el: Element) => {
    dispatch({ type: 'SET_CONTAINER', payload: el });
  };
  const onClose = () => {
    dispatch({ type: 'ON_CLOSE' });
  };

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
      const win = window.open('', '', 'width=600,height=600,left=200,top=200');
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
          dispatch({ type: 'ON_CLOSE' });
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

  useEffect(() => {
    popup?.focus();
  });

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
        <CacheProvider value={styleCache}>{props.children}</CacheProvider>,
        container
      )
    : null;
};
