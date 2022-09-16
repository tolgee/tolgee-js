import { useTranslate } from '@tolgee/react';

export const Test2 = () => {
  const { t, isLoading } = useTranslate(['test2']);
  if (isLoading) {
    return <>Loading2</>;
  }
  return <div>{t('test')}</div>;
};
