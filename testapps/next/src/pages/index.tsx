import type { GetStaticProps, NextPage } from 'next';
import { getServerLocales, TolgeeNextProvider } from '../tolgeeNext';
import { Todos } from '../views/Todos';

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      locales: await getServerLocales(context.locale),
    },
  };
};

const Home: NextPage<{ locales: any }> = ({ locales }) => {
  return (
    <TolgeeNextProvider locales={locales}>
      <Todos />
    </TolgeeNextProvider>
  );
};

export default Home;
