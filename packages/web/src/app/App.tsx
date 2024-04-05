import { useEffect } from 'react';
import { secrets, tolgee, useTolgee } from './basicTolgee';
import { styled } from '@mui/material';
import { UI } from '../package/ui';

const StyledContainer = styled('div')`
  margin: 100px auto;
  max-width: 300px;
`;

const ui = new UI({
  ...secrets,
  projectId: undefined,
  highlight: tolgee.highlight,
  findPositions: tolgee.findPositions,
  changeTranslation: tolgee.changeTranslation,
  onPermanentChange: undefined,
});

export const App = () => {
  const tolgee = useTolgee(['update', 'language']);

  useEffect(() => {
    tolgee.run();
    ui.renderViewer('on-the-road-title', 'Default value', [''], '');
  }, []);

  return (
    <StyledContainer>
      <div>{tolgee.t('on-the-road-title')}</div>
      <div>
        {tolgee.t('on-the-road-title')}
        {tolgee.t('on-the-road-subtitle')}
      </div>
    </StyledContainer>
  );
};
