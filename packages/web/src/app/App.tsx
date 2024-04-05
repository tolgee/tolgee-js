import { useEffect } from 'react';
import { secrets, tolgee, useTolgee } from './basicTolgee';
import { styled } from '@mui/material';
import { InContextUi } from '../package/ui/InContextUi';

const StyledContainer = styled('div')`
  margin: 100px auto;
  max-width: 300px;
`;

const ui = InContextUi({
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
    ui.openKeyDialog({
      key: 'on-the-road-title',
      defaultValue: 'Default value',
      fallbackNamespaces: [''],
      namespace: '',
    });
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
