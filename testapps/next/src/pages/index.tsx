import type { GetStaticProps, NextPage } from 'next';
import { getServerLocales, TolgeeNextProvider } from '../tolgeeNext';
import { Todos } from '../views/Todos';

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      staticData: await getServerLocales(context.locale),
    },
  };
};

const Home: NextPage<{ staticData: any }> = ({ staticData }) => {
  return (
    <TolgeeNextProvider staticData={staticData}>
      <Todos />
    </TolgeeNextProvider>
  );
};

export default Home;
