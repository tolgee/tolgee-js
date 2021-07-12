import * as React from 'react';
import { FunctionComponent } from 'react';
import { useWithStyles } from './common/useWithStyles';

const css = `
.tolgee-circular-loader {
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: tolgee-circular-loader-spin 1s linear infinite;
}

@keyframes tolgee-circular-loader-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;

export const CircularLoading: FunctionComponent = () => {
  useWithStyles(css);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div className="tolgee-circular-loader" />
    </div>
  );
};
