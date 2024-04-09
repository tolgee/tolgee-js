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
      <div title="test">{tolgee.t('on-the-road-title')}</div>
      <div>
        {tolgee.t('on-the-road-title')}
        {tolgee.t('on-the-road-subtitle')}
      </div>
      <button disabled>{tolgee.t('app-title')}</button>
      <div style={{ pointerEvents: 'none' }}>
        <div>{tolgee.t('app-title')}</div>
      </div>
    </StyledContainer>
  );
};
