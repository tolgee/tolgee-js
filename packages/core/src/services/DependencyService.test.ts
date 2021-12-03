jest.dontMock('./DependencyService');
jest.dontMock('../TolgeeConfig');

import { getMockedInstance } from '@testFixtures/mocked';
import { mocked } from 'ts-jest/utils';
import { InvisibleWrapper } from '../wrappers/invisible/InvisibleWrapper';
import { TextWrapper } from '../wrappers/text/TextWrapper';
import { DependencyService } from './DependencyService';

describe('DependecyStore', () => {
  let dependecyService: DependencyService;

  const config = {
    apiKey: 'yep',
  };

  beforeEach(async () => {
    dependecyService = new DependencyService();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('inits translation service', () => {
    dependecyService.init(config);
    dependecyService.run();
    expect(
      mocked(dependecyService.translationService).initStatic
    ).toBeCalledTimes(1);
  });

  it('sets config to properties', () => {
    dependecyService.init(config);
    expect(dependecyService.properties.config.apiKey).toEqual(config.apiKey);
  });

  it('inits text wrapper', () => {
    dependecyService.init(config);
    dependecyService.run();
    expect(dependecyService.wrapper).toEqual(getMockedInstance(TextWrapper));
  });

  it('inits invisible wrapper', () => {
    dependecyService.init({ ...config, wrapperMode: 'invisible' });
    dependecyService.run();
    expect(dependecyService.wrapper).toEqual(
      getMockedInstance(InvisibleWrapper)
    );
  });
});
