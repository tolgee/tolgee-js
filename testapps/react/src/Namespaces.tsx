import { useTranslate } from '@tolgee/react';
import { Navbar } from './components/Navbar';

export const Namespaces = () => {
  const { t, isLoading } = useTranslate(['base']);

  if (isLoading) {
    return <>Base is loading</>;
  }
  return (
    <main className="background-wrapper">
      <div className="example">
        <Navbar>
          <a href="/">The example app</a>
        </Navbar>
        {t('test')}
        <Test1 />
        <Test2 />
        <Test3 />
      </div>
    </main>
  );
};

export const Test1 = () => {
  const { t, isLoading } = useTranslate();
  if (isLoading) {
    return <>Loading1</>;
  }
  return <div>{t('fuck', 'Aaaaaaaaaaaaaaaaaa')}</div>;
};

export const Test2 = () => {
  const { t, isLoading } = useTranslate(['test2']);
  if (isLoading) {
    return <>Loading2</>;
  }
  return <div>{t('test')}</div>;
};

export const Test3 = () => {
  const { t, isLoading } = useTranslate(['test3']);
  if (isLoading) {
    return <>Loading3</>;
  }
  return <div>{t('test')}</div>;
};
