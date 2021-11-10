import React from 'react';

import { AppWrapper } from '../views/AppWrapper';
import { TranslationMethods } from '../views/TranslationMethods';

const TranslationMethodsPage: React.FC = () => {
  return (
    <AppWrapper>
      <TranslationMethods />
    </AppWrapper>
  );
};

export default TranslationMethodsPage;
