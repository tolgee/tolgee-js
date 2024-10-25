import type { GetStaticProps, NextPage } from 'next';
import { getServerLocales, TolgeeNextProvider } from '../tolgeeNext';
import { TranslationMethods } from '../views/TranslationMethods';

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      staticData: await getServerLocales(context.locale, ['', 'namespaced']),
    },
  };
};

const Home: NextPage<{ staticData: any }> = ({ staticData }) => {
  return (
    <TolgeeNextProvider staticData={staticData}>
      <TranslationMethods />
    </TolgeeNextProvider>
  );
};

export default Home;
