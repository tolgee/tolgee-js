jest.dontMock('./DependencyStore');

import { getMockedInstance } from '@testFixtures/mocked';
import { mocked } from 'ts-jest/utils';
import { Properties } from '../Properties';
import { DependencyStore } from './DependencyStore';

describe('DependecyStore', () => {
  let dependencyStore: DependencyStore;

  const config = {
    apiKey: 'yep',
  };

  beforeEach(async () => {
    dependencyStore = new DependencyStore(config);
    getMockedInstance(Properties).config.targetElement = document.body;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('inits translation service', () => {
    expect(
      mocked(dependencyStore.translationService).initStatic
    ).toBeCalledTimes(1);
  });

  it('sets config to properties', () => {
    expect(dependencyStore.properties.config).toEqual(config);
  });
});
