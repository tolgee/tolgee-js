import { useTranslate } from '@tolgee/react';

export const Test1 = () => {
  const { t, isLoading } = useTranslate(['', 'base', 'test1']);
  if (isLoading) {
    return <>Loading1</>;
  }
  return <div>{t('fuck', 'Aaaaaaaaaaaaaaaaaa')}</div>;
};
