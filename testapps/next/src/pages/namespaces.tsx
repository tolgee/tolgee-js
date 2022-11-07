import type { GetStaticProps, NextPage } from 'next';
import { getServerLocales, TolgeeNextProvider } from '../tolgeeNext';
import { Namespaces } from '../views/Namespaces';

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      locales: await getServerLocales(context.locale, [
        '',
        'base',
        'test1',
        'test2',
        'test3',
      ]),
    },
  };
};

const Home: NextPage<{ locales: any }> = ({ locales }) => {
  return (
    <TolgeeNextProvider locales={locales}>
      <Namespaces />
    </TolgeeNextProvider>
  );
};

export default Home;
