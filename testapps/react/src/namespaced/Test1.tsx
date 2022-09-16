import { useTranslate } from '@tolgee/react';

export const Test1 = () => {
  const { t, isLoading } = useTranslate(['test1']);
  if (isLoading) {
    return <>Loading1</>;
  }
  return (
    <div>{t('test', 'Youdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')}</div>
  );
};
