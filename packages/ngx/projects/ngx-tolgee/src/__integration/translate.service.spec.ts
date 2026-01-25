import { TestBed } from '@angular/core/testing';
import { TranslateService } from '../lib/translate.service';
import { Tolgee } from '@tolgee/web';
import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';
import mockTranslations from '@tolgee/testing/mockTranslations';
import { wait } from '@tolgee/testing/wait';
import { provideTolgee } from '../lib/provide-tolgee';
import { take } from 'rxjs';

let staticDataMock: ReturnType<typeof mockStaticDataAsync>;

describe('translation service', () => {
  let service: TranslateService;
  let onSpy: jest.SpyInstance;

  beforeEach(async () => {
    staticDataMock = mockStaticDataAsync();
    TestBed.configureTestingModule({
      providers: [
        provideTolgee(() => ({
          ...Tolgee().init({
            staticData: {
              ...staticDataMock.promises,
              en: mockTranslations.en,
            },
            language: 'en',
          }),
        })),
      ],
    });
    service = TestBed.inject(TranslateService);
    onSpy = jest.spyOn(service.tolgee, 'on');
  });

  it('emits when lang changes', async () => {
    const languageCallback = jest.fn();
    service.on('language').pipe(take(1)).subscribe(languageCallback);
    const promise = service.tolgee.changeLanguage('cs');
    expect(languageCallback).toHaveBeenCalledTimes(0);
    await wait(0);
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
    service.tolgee.changeLanguage('cs');
    subscription.unsubscribe();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('lang async works', () => {
    const languageCallback = jest.fn();
    service.languageAsync.subscribe(languageCallback);
    service.tolgee.changeLanguage('cs');
    expect(onSpy).toHaveBeenCalledTimes(1);
  });

  it('changeLanguage works', async () => {
    const languageCallback = jest.fn();
    service.languageAsync.subscribe(languageCallback);
    const changePromise = service.changeLanguage('cs');
    await wait(0);
    staticDataMock.resolvablePromises.cs.resolve();
    await changePromise;
    expect(service.language).toEqual('cs');
  });

  it('returns current language', () => {
    expect(service.language).toEqual('en');
  });
});

describe('translation service with promise-based tolgee', () => {
  let service: TranslateService;
  let staticDataMock: ReturnType<typeof mockStaticDataAsync>;

  it('resolves tolgee promise on start()', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideTolgee(() =>
          Promise.resolve(
            Tolgee().init({
              staticData: {
                en: mockTranslations.en,
                cs: mockTranslations.cs,
              },
              language: 'en',
            })
          )
        ),
      ],
    });

    service = TestBed.inject(TranslateService);

    // Before start, tolgee getter should throw
    expect(() => service.tolgee).toThrow(
      'Tolgee instance is not yet resolved. Call start() first or wait for app initialization.'
    );

    // Call start to resolve the promise
    await service.start();

    // After start, tolgee should be resolved
    expect(service.tolgee).toBeDefined();
    expect(service.tolgee).not.toBeInstanceOf(Promise);
    expect(service.tolgee.isRunning()).toEqual(true);
    expect(service.tolgee.isLoaded()).toEqual(true);
  });

  it('throws error when accessing tolgee before start() is called', () => {
    TestBed.configureTestingModule({
      providers: [
        provideTolgee(() =>
          Promise.resolve(
            Tolgee().init({
              staticData: {
                en: mockTranslations.en,
              },
              language: 'en',
            })
          )
        ),
      ],
    });

    service = TestBed.inject(TranslateService);

    expect(() => service.tolgee).toThrow(
      'Tolgee instance is not yet resolved. Call start() first or wait for app initialization.'
    );
  });

  it('works with service methods after promise resolution', async () => {
    staticDataMock = mockStaticDataAsync();

    TestBed.configureTestingModule({
      providers: [
        provideTolgee(() =>
          Promise.resolve(
            Tolgee().init({
              staticData: {
                ...staticDataMock.promises,
                en: mockTranslations.en,
              },
              language: 'en',
            })
          )
        ),
      ],
    });

    service = TestBed.inject(TranslateService);
    await service.start();

    expect(service.language).toEqual('en');

    const languageCallback = jest.fn();
    service.languageAsync.subscribe(languageCallback);

    const changePromise = service.changeLanguage('cs');
    await wait(0);
    staticDataMock.resolvablePromises.cs.resolve();
    await changePromise;
    expect(service.language).toEqual('cs');

    expect(service.instant('hello_world')).toEqual(
      mockTranslations.cs.hello_world
    );
  });

  it('handles translate() observable with promise-based tolgee', async () => {
    const tolgeeInstance = Tolgee().init({
      staticData: {
        en: mockTranslations.en,
        cs: mockTranslations.cs,
      },
      language: 'en',
    });

    TestBed.configureTestingModule({
      providers: [provideTolgee(() => Promise.resolve(tolgeeInstance))],
    });

    service = TestBed.inject(TranslateService);
    await service.start();

    const translateCallback = jest.fn();
    service.translate('hello_world').pipe(take(1)).subscribe(translateCallback);

    await wait(0);
    expect(translateCallback).toHaveBeenCalledWith(
      mockTranslations.en.hello_world
    );
  });

  it('start() can be called multiple times safely with promise-based tolgee', async () => {
    const runMock = jest.fn(async () => {});
    const tolgeeInstance = {
      ...Tolgee().init({
        staticData: {
          en: mockTranslations.en,
        },
        language: 'en',
      }),
      run: runMock,
    } as any;

    TestBed.configureTestingModule({
      providers: [provideTolgee(() => Promise.resolve(tolgeeInstance))],
    });

    service = TestBed.inject(TranslateService);

    await service.start();
    await service.start();
    await service.start();

    expect(runMock).toHaveBeenCalledTimes(1);
    expect(service.tolgee).toBeDefined();
  });
});
