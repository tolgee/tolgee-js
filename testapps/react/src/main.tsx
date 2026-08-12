// Must be first: sets the in-context loader override before App.tsx builds the Tolgee instance at module scope.
import './inContextUrl';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
