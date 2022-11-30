import type { GetStaticProps, NextPage } from 'next';
import { getServerLocales, TolgeeNextProvider } from '../tolgeeNext';
import { TranslationMethods } from '../views/TranslationMethods';

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      locales: await getServerLocales(context.locale, ['', 'namespaced']),
    },
  };
};

const Home: NextPage<{ locales: any }> = ({ locales }) => {
  return (
    <TolgeeNextProvider locales={locales}>
      <TranslationMethods />
    </TolgeeNextProvider>
  );
};

export default Home;
