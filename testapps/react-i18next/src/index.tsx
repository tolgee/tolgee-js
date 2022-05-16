import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './i18next';

import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
