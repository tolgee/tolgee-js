import { ApiClientInstance } from '../utils/ApiClient';

export const defaultMocks: ApiClientInstance = {
  getLanguages: jest.fn(async () => {
    return {};
  }),
  getTranslations: jest.fn(async () => {
    return {};
  }),
};

let overrideMocks: Partial<ApiClientInstance> = {};

export const mockApiClient = (mocks: Partial<ApiClientInstance>) => {
  overrideMocks = {
    ...mocks,
  };
};

jest.mock('../utils/ApiClient', () => {
  const originalModule = jest.requireActual('../utils/ApiClient');

  return {
    __esModule: true,
    ...originalModule,
    ApiClient: (): ApiClientInstance => ({
      ...defaultMocks,
      ...overrideMocks,
    }),
  };
});
