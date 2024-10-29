import type { GetServerSideProps, NextPage } from 'next';
import { tolgee, TolgeeNextProvider } from '../tolgeeNext';
import { Todos } from '../views/Todos';

export const getStaticProps: GetServerSideProps = async (context) => {
  return {
    props: {
      locales: await tolgee.loadMatrix([context.locale!]),
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
