import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import { useDialogContext, useDialogActions } from './dialogContext';

export const NewWindow = (props: React.PropsWithChildren) => {
  const newWindow = useRef<Window>(null);
  const [popup, setPopup] = useState<Window | null>(null);
  const { setContainer, onClose } = useDialogActions();
  const container = useDialogContext((c) => c.container);

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
      const win = window.open(
        '',
        '_blank',
        'width=600,height=600,left=200,top=200,toolbar=0'
      );

      if (!win) {
        return;
      }

      win.document.title = 'Tolgee - Translate Text';
      if (!win.document) {
        alert('Please allow popups to open new window.');
      }
      // @ts-ignore
      newWindow.current = win;
      // Append container
      win.document.body.style.margin = '0px';
      win.document.body.style.background = 'white';
      win.document.body.appendChild(container);

      const onExit = () => {
        setContainer(undefined);
        win.close();
        onClose();
      };

      win.onbeforeunload = () => {
        setContainer(undefined);
        onClose();
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
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
        setContainer(undefined);
        newWindow.current?.close();
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
      prepend: true,
    });
  }, [popup]);

  return popup && container
    ? createPortal(
        <CacheProvider value={styleCache}>{props.children}</CacheProvider>,
        container
      )
    : null;
};
