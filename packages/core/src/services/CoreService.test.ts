jest.dontMock('./CoreService');
jest.dontMock('./DependencyService');

import '@testing-library/jest-dom/extend-expect';
import { CoreService } from './CoreService';
import { getMockedInstance } from '@testFixtures/mocked';
import { ApiHttpService } from './ApiHttpService';
import { mocked } from 'ts-jest/utils';
import { Properties } from '../Properties';
import { Scope } from '../types';
import { DependencyService } from './DependencyService';

describe('CoreService', () => {
  let coreService: CoreService;
  let mockedFetchJson;

  beforeEach(() => {
    coreService = new DependencyService().coreService;
    getMockedInstance(Properties).preferredLanguages = new Set<string>();
    getMockedInstance(Properties).config = {
      inputPrefix: '{{',
      inputSuffix: '}}',
      restrictedElements: [],
      tagAttributes: {
        '*': ['aria-label'],
      },
    };
    mockedFetchJson = mocked(getMockedInstance(ApiHttpService).fetchJson);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('can be created', () => {
    expect(coreService).not.toBeNull();
  });

  describe('getLanguages', () => {
    const dummyLanguages = ['dummyLang1', 'dummyLang2'];

    beforeEach(() => {
      mockedFetchJson.mockImplementation(async () => {
        return {
          _embedded: {
            languages: dummyLanguages.map((l) => ({
              tag: l,
            })),
          },
        };
      });
    });

    test('will return languages returned from api http service', async () => {
      expect(await coreService.getLanguages()).toEqual(new Set(dummyLanguages));
      expect(mockedFetchJson).toBeCalledTimes(1);
      expect(mockedFetchJson).toBeCalledWith(`v2/projects/languages?size=1000`);
    });

    test('sets preferred languages of properties', async () => {
      getMockedInstance(Properties).preferredLanguages = new Set([
        dummyLanguages[0],
      ]);
      await coreService.getLanguages();
      expect(getMockedInstance(Properties).preferredLanguages).toEqual(
        new Set([dummyLanguages[0]])
      );
    });
  });

  describe('getScopes', () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();

    test('will switch to production mode on error', async () => {
      mocked(mockedFetchJson).mockImplementation(async () => {
        throw new Error();
      });
      await coreService.getApiKeyDetails();
      expect(getMockedInstance(Properties).mode).toEqual('production');
      // eslint-disable-next-line no-console
      expect(console.error).toBeCalledTimes(2);
    });

    test('will return value from http service', async () => {
      const mockedReturn = {
        scopes: ['translations.view', 'translations.edit'],
      };
      mocked(mockedFetchJson).mockImplementation(async () => mockedReturn);
      expect(await coreService.getApiKeyDetails()).toEqual(mockedReturn);
    });
  });

  describe('loadApiKeyDetails', () => {
    beforeEach(() => {
      const mockedReturn = {
        scopes: ['translations.edit'],
        projectId: 0,
      };
      mocked(mockedFetchJson).mockImplementation(async () => mockedReturn);
    });

    test('will set properties.scopes on run in development mode', async () => {
      const propertiesMock = getMockedInstance(Properties);
      propertiesMock.mode = 'development';
      await coreService.loadApiKeyDetails();
      expect(propertiesMock.scopes).toContain('translations.edit' as Scope);
      expect(propertiesMock.scopes).not.toContain('translations.view' as Scope);
    });

    test('will set properties.projectId on run in development mode', async () => {
      const propertiesMock = getMockedInstance(Properties);
      propertiesMock.mode = 'development';
      await coreService.loadApiKeyDetails();
      expect(propertiesMock.projectId).toEqual(0);
    });
  });

  describe('Authorization', () => {
    test('will return proper value on isAuthorizedTo', () => {
      getMockedInstance(Properties).scopes = [
        'translations.edit',
        'translations.view',
      ] as Scope[];
      expect(coreService.isAuthorizedTo('keys.edit')).toBeFalsy();
      expect(coreService.isAuthorizedTo('translations.view')).toBeTruthy();
    });

    test('will return proper on checkScopes', () => {
      getMockedInstance(Properties).scopes = [
        'translations.edit',
        'translations.view',
      ] as Scope[];
      expect(jest.fn(() => coreService.checkScope('keys.edit'))).toThrowError();
      const checkMock = jest.fn(() =>
        coreService.checkScope('translations.view')
      );
      checkMock();
      expect(checkMock).toReturn();
    });
  });
});
