import { useTranslate } from '@tolgee/react';

export const Test3 = () => {
  const { t, isLoading } = useTranslate(['test3']);
  if (isLoading) {
    return <>Loading3</>;
  }
  return <div>{t('test')}</div>;
};
