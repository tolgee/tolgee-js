import { useTranslation } from 'react-i18next';

export const Test: React.FC = () => {
  const { t } = useTranslation('todos');
  return t('share-button');
};
