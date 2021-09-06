jest.dontMock('./CoreService');
jest.dontMock('./DependencyStore');

import '@testing-library/jest-dom/extend-expect';
import { CoreService } from './CoreService';
import { getMockedInstance } from '@testFixtures/mocked';
import { ApiHttpService } from './ApiHttpService';
import { mocked } from 'ts-jest/utils';
import { Properties } from '../Properties';
import { Scope } from '../types';
import { ApiHttpError } from '../Errors/ApiHttpError';
import { DependencyStore } from './DependencyStore';

describe('CoreService', () => {
  let coreService: CoreService;
  let mockedFetchJson;

  beforeEach(() => {
    coreService = new DependencyStore().coreService;
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
        return dummyLanguages;
      });
    });

    test('will return languages returned from api http service', async () => {
      expect(await coreService.getLanguages()).toEqual(new Set(dummyLanguages));
      expect(mockedFetchJson).toBeCalledTimes(1);
      expect(mockedFetchJson).toBeCalledWith(`languages`);
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
        throw new ApiHttpError(new Response());
      });
      await coreService.getScopes();
      expect(getMockedInstance(Properties).config.mode).toEqual('production');
      // eslint-disable-next-line no-console
      expect(console.error).toBeCalledTimes(2);
    });

    test('will return value from http service', async () => {
      const mockedReturn = ['translations.view', 'translations.edit'];
      mocked(mockedFetchJson).mockImplementation(
        async () => mockedReturn as Scope[]
      );
      expect(await coreService.getScopes()).toEqual(mockedReturn);
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
