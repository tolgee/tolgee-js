import { useEffect } from 'react';
import { useTolgee } from './basicTolgee';
import { styled } from '@mui/material';

const StyledContainer = styled('div')`
  margin: 100px auto;
  max-width: 300px;
`;

export const App = () => {
  const tolgee = useTolgee(['update', 'language']);

  useEffect(() => {
    tolgee.run();
  }, []);

  return (
    <StyledContainer>
      <div title="test">{tolgee.t('app-title')}</div>
      <div>
        {tolgee.t('app-title')}
        {tolgee.t('add-item-input-placeholder')}
      </div>
      <button disabled>{tolgee.t('app-title')}</button>
      <div style={{ pointerEvents: 'none' }}>
        <div>{tolgee.t('app-title')}</div>
      </div>
      <div>
        <div>{tolgee.t('new-key')}</div>
      </div>
    </StyledContainer>
  );
};
