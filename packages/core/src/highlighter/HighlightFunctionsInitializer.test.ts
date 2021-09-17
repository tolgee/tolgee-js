jest.dontMock('./HighlightFunctionsInitializer');
jest.dontMock('../services/DependencyStore');

import { HighlightFunctionsInitializer } from './HighlightFunctionsInitializer';
import { getMockedInstance } from '@testFixtures/mocked';
import { Properties } from '../Properties';
import { ElementWithMeta } from '../types';
import { DependencyStore } from '../services/DependencyStore';

describe('HighlightFunctionsInitializer', () => {
  let highlightFunctionInitializer: HighlightFunctionsInitializer;
  let mockedElement: ElementWithMeta;
  const mockedColor = 'rgb(0, 30, 50)';

  beforeEach(async () => {
    jest.clearAllMocks();
    highlightFunctionInitializer = new DependencyStore()
      .highlightFunctionInitializer;
    mockedElement = document.createElement('div') as Element as ElementWithMeta;
    getMockedInstance(Properties).config.highlightColor = mockedColor;
    (mockedElement._tolgee as any) = {};
    highlightFunctionInitializer.initFunctions(mockedElement);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('Will reset to correct initial color', async () => {
    mockedElement.style.backgroundColor = '#222222';
    mockedElement._tolgee.highlight();
    mockedElement._tolgee.unhighlight();
    expect(mockedElement.style.backgroundColor).toEqual('rgb(34, 34, 34)');
  });

  test('Will highlight', async () => {
    mockedElement._tolgee.highlight();
    expect(mockedElement.style.backgroundColor).toEqual(mockedColor);
  });
});
