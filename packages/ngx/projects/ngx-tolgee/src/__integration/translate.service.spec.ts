import { TranslateService } from '../lib/translate.service';
import { Tolgee, TolgeeInstance } from '@tolgee/web';
import { NgxPlugin } from '../lib/NgxPlugin';
import { mockStaticDataAsync } from '@testing/mockStaticData';

let staticDataMock: ReturnType<typeof mockStaticDataAsync>;

describe('translation service', () => {
  let tolgee: TolgeeInstance;
  let service: TranslateService;
  let onSpy: jest.SpyInstance;
  beforeEach(async () => {
    staticDataMock = mockStaticDataAsync();
    tolgee = {
      ...Tolgee().use(NgxPlugin()).init({
        staticData: staticDataMock.promises,
        language: 'en',
      }),
    };
    service = new TranslateService(tolgee);
    onSpy = jest.spyOn(tolgee, 'on');
    staticDataMock.resolvablePromises.en.resolve();
    await tolgee.run();
  });

  it('emits when lang changes', async () => {
    const languageCallback = jest.fn();
    service.on('language').subscribe(languageCallback);
    const promise = tolgee.changeLanguage('cs');
    expect(languageCallback).toHaveBeenCalledTimes(0);
    staticDataMock.resolvablePromises.cs.resolve();
    await promise;
    expect(languageCallback).toHaveBeenCalledTimes(1);
    expect(onSpy).toHaveBeenCalledTimes(1);
  });

  it('calls unsubscribe when unsubscribing using on', () => {
    const languageCallback = jest.fn();
    const unsubscribeMock = jest.fn();
    const onMock = jest.fn(() => ({
      unsubscribe: unsubscribeMock,
    }));
    onSpy.mockImplementation(onMock);
    const subscription = service.on('language').subscribe(languageCallback);
    tolgee.changeLanguage('cs');
    subscription.unsubscribe();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('lang async works', () => {
    const languageCallback = jest.fn();
    service.languageAsync.subscribe(languageCallback);
    tolgee.changeLanguage('cs');
    expect(onSpy).toHaveBeenCalledTimes(1);
  });

  it('changeLanguage works', async () => {
    const languageCallback = jest.fn();
    service.languageAsync.subscribe(languageCallback);
    const changePromise = service.changeLanguage('cs');
    staticDataMock.resolvablePromises.cs.resolve();
    await changePromise;
    expect(service.language).toEqual('cs');
  });

  it('returns current language', () => {
    expect(service.language).toEqual('en');
  });
});
