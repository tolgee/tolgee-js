import { useTranslate } from '@tolgee/react';
import { LangSelector } from './components/LangSelector';
import { Test1 } from './namespaced/Test1';
import { Test2 } from './namespaced/Test2';
import { Test3 } from './namespaced/Test3';

export const Namespaces = () => {
  const { t, isLoading } = useTranslate(['base']);

  if (isLoading) {
    return <>Base is loading</>;
  }
  return (
    <div>
      <LangSelector />
      {t('test')}
      <Test1 />
      <Test2 />
      <Test3 />
    </div>
  );
};
