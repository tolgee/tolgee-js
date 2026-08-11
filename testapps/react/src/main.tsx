import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './style.css';

// Dev only: load the in-context editor UMD from a local build (via VITE_APP_IN_CONTEXT_URL) instead of the CDN, so
// unpublished @tolgee/web changes (e.g. OAuth Bearer support) can be exercised. Inert when the env var is unset.
if (import.meta.env.VITE_APP_IN_CONTEXT_URL) {
  (
    window as unknown as { __TOLGEE_IN_CONTEXT_URL__?: string }
  ).__TOLGEE_IN_CONTEXT_URL__ = import.meta.env.VITE_APP_IN_CONTEXT_URL;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
