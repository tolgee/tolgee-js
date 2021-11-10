import React from 'react';

import { Todos } from '../views/Todos';
import { AppWrapper } from '../views/AppWrapper';

const IndexPage: React.FC = () => {
  return (
    <AppWrapper>
      <Todos />
    </AppWrapper>
  );
};

export default IndexPage;
