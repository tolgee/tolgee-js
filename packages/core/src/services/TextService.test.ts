jest.dontMock('./TextService');
jest.dontMock('../helpers/TextHelper');
jest.dontMock('./DependencyService');
jest.dontMock('./ModuleService');
jest.dontMock('../modules/IcuFormatter');

import { Properties } from '../Properties';
import { TextService } from './TextService';
import { getMockedInstance } from '@testFixtures/mocked';
import { TranslationService } from './TranslationService';
import { DependencyService } from './DependencyService';
import { IcuFormatter } from '../modules/IcuFormatter';

describe('TextService', () => {
  let mockedTranslationReturn = '';
  const params = { param1: 'Dummy param 1', param2: 'Dummy param 2' };
  let expectedTranslated = '';
  let textService: TextService;

  const getTranslationMock = jest.fn(async () => {
    return mockedTranslationReturn;
  });

  const getFromCacheOrCallbackMock = jest.fn(() => {
    return mockedTranslationReturn;
  });

  beforeEach(async () => {
    const depStore = new DependencyService();
    depStore.moduleService.addModule(IcuFormatter);
    textService = depStore.textService;
    mockedTranslationReturn = 'Dummy translated text {param1} {param2}';
    expectedTranslated = mockedTranslationReturn
      .replace('{param1}', params.param1)
      .replace('{param2}', params.param2);

    getMockedInstance(Properties).config = {
      inputPrefix: '{{',
      inputSuffix: '}}',
      restrictedElements: [],
      tagAttributes: {
        '*': ['aria-label'],
      },
    };
    getMockedInstance(TranslationService).getTranslation = getTranslationMock;

    getMockedInstance(TranslationService).getFromCacheOrFallback =
      getFromCacheOrCallbackMock;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('translation functions', () => {
    test('it will translate asynchronously correctly', async () => {
      const translated = await textService.translate(
        mockedTranslationReturn,
        params,
        `en`,
        true,
        'Default'
      );
      expect(translated).toEqual(expectedTranslated);
      expect(getTranslationMock).toBeCalledWith(
        'Dummy translated text {param1} {param2}',
        'en',
        'Default'
      );
    });

    test('it will translate synchronously correctly', () => {
      const translated = textService.instant(
        mockedTranslationReturn,
        params,
        'en',
        true,
        'Default'
      );
      expect(translated).toEqual(expectedTranslated);
      expect(getFromCacheOrCallbackMock).toBeCalledWith(
        'Dummy translated text {param1} {param2}',
        'en',
        'Default'
      );
    });
  });
});
