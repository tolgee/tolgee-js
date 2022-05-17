jest.dontMock('./HighlightFunctionsInitializer');
jest.dontMock('../services/DependencyService');

import { HighlightFunctionsInitializer } from './HighlightFunctionsInitializer';
import { ElementWithMeta } from '../types';
import { DependencyService } from '../services/DependencyService';

describe('HighlightFunctionsInitializer', () => {
  let highlightFunctionInitializer: HighlightFunctionsInitializer;
  let mockedElement: ElementWithMeta;

  beforeEach(async () => {
    document.body.appendChild = jest.fn();
    jest.clearAllMocks();
    const dependencyService = new DependencyService();
    dependencyService.init({});
    highlightFunctionInitializer =
      dependencyService.highlightFunctionInitializer;
    mockedElement = document.createElement('div') as Element as ElementWithMeta;
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
    jest.spyOn(mockedElement, 'isConnected', 'get').mockReturnValue(true);
    mockedElement._tolgee.highlight();
    expect(document.body.appendChild).toBeCalled();
  });
});
