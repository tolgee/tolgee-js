import * as Module from '../CoreService';
import classMock from '@testFixtures/classMock';
import { Scope } from '../../types';

const moduleMock = jest.genMockFromModule('../CoreService');

export const CoreService = classMock<Module.CoreService>(
  () => ({
    getApiKeyDetails: jest.fn(async () => {
      return {
        scopes: ['translations.edit', 'keys.edit'] as Scope[],
        projectId: 0,
      } as Module.ApiKeyModel;
    }),
  }),
  (moduleMock as typeof Module).CoreService
);
