import * as Module from '../CoreService';
import classMock from '@testFixtures/classMock';
import { Scope } from '../../types';

const moduleMock = jest.genMockFromModule('../CoreService');

export const CoreService = classMock<Module.CoreService>(
  () => ({
    getScopes: jest.fn(async () => {
      return ['translations.edit', 'keys.edit'] as Scope[];
    }),
  }),
  (moduleMock as typeof Module).CoreService
);
