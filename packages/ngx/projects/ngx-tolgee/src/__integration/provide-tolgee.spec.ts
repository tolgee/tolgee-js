import { TestBed } from '@angular/core/testing';
import { TranslateService } from '../lib/translate.service';
import { Tolgee, DevTools } from '@tolgee/web';
import mockTranslations from '@tolgee/testing/mockTranslations';
import { provideTolgee } from '../lib/provide-tolgee';
import { TOLGEE_INSTANCE } from '../lib/tolgee-instance-token';
import { mockCoreFetch } from '@tolgee/testing/fetchMock';
import {
  createEnvironmentInjector,
  EnvironmentInjector,
  ApplicationInitStatus,
} from '@angular/core';

describe('translation service', () => {
  let service: TranslateService;
  const fetchMock = mockCoreFetch();

  beforeEach(async () => {
    fetchMock.enableMocks();
    TestBed.configureTestingModule({
      providers: [
        provideTolgee(() =>
          Tolgee()
            .use(DevTools())
            .init({
              apiUrl: 'http://localhost',
              apiKey: 'dummyApiKey',
              staticData: {
                en: mockTranslations.en,
                cs: mockTranslations.cs,
              },
              language: 'en',
            })
        ),
      ],
    });

    service = TestBed.inject(TranslateService);
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  it('translate service is provided', () => {
    expect(service).toBeDefined();
  });

  it('provided tolgee instance equals the service exposed', () => {
    const tolgeeInstance = TestBed.inject(TOLGEE_INSTANCE);
    expect(tolgeeInstance).toBeDefined();
    expect(tolgeeInstance).toEqual(service.tolgee);
  });

  it('tolgee is loaded and running', () => {
    expect(service.tolgee.isRunning()).toEqual(true);
    expect(service.tolgee.isLoaded()).toEqual(true);
    expect(service.tolgee.isDev()).toEqual(true);
  });

  it('tolgee dev mode adds invisible chars to translations', () => {
    expect(service.tolgee.isDev()).toEqual(true);
    const text = service.instant('hello_world');
    expect(text).toContain(mockTranslations.en.hello_world);
    expect(text.length).toBeGreaterThan(12);
    const INVISIBLE_GLOBAL_RE =
      /[\u200B-\u200F\u202A-\u202E\u2060\u2066-\u2069\uFEFF]/g;
    expect((text.match(INVISIBLE_GLOBAL_RE) ?? []).length).toBeGreaterThan(0);
  });

  it('calling start twice runs tolgee only once', async () => {
    const tolgeeMock = {
      run: jest.fn(async () => {}),
      stop: jest.fn(),
    } as any;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideTolgee(() => tolgeeMock)],
    });

    const translateService = TestBed.inject(TranslateService);

    await translateService.start();
    await translateService.start();

    expect(tolgeeMock.run).toHaveBeenCalledTimes(1);
  });

  it('destroying the injector calls tolgee.stop()', () => {
    const tolgeeMock = {
      run: jest.fn(async () => {}),
      stop: jest.fn(),
    } as any;

    const parent = TestBed.inject(EnvironmentInjector);
    const injector = createEnvironmentInjector(
      [provideTolgee(() => tolgeeMock)],
      parent
    );

    injector.get(TranslateService); // instantiate service
    injector.destroy();

    expect(tolgeeMock.stop).toHaveBeenCalledTimes(1);
  });

  it('factory is called once and token/service share the same instance', () => {
    const tolgeeMock = {
      run: jest.fn(async () => {}),
      stop: jest.fn(),
    } as any;

    const factory = jest.fn(() => tolgeeMock);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideTolgee(factory)],
    });

    const tokenA = TestBed.inject(TOLGEE_INSTANCE);
    const tokenB = TestBed.inject(TOLGEE_INSTANCE);

    expect(factory).toHaveBeenCalledTimes(1);
    expect(tokenA).toBe(tolgeeMock);
    expect(tokenB).toBe(tolgeeMock);
    expect(TestBed.inject(TranslateService).tolgee).toBe(tolgeeMock);
  });

  it('translates even it tolgee fails to start', async () => {
    const tolgeeMock = {
      ...Tolgee().init({
        staticData: {
          en: mockTranslations.en,
          cs: mockTranslations.cs,
        },
        language: 'en',
      }),
      run: jest.fn(async () => {
        throw new Error('run failed');
      }),
      stop: jest.fn(),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideTolgee(() => tolgeeMock)],
    });

    const translateService = TestBed.inject(TranslateService);
    expect(translateService.instant('hello_world')).toEqual(
      mockTranslations.en.hello_world
    );
    await translateService.changeLanguage('cs');
    expect(translateService.instant('hello_world')).toEqual(
      mockTranslations.cs.hello_world
    );
    expect(tolgeeMock.run).toHaveBeenCalledTimes(1);
  });

  it('supports providing tolgee as a promise (e.g., from dynamic import)', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideTolgee(() =>
          Promise.resolve(
            Tolgee()
              .use(DevTools())
              .init({
                apiUrl: 'http://localhost',
                apiKey: 'dummyApiKey',
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

    // Wait for app initializers to complete
    const appInitStatus = TestBed.inject(ApplicationInitStatus);
    await appInitStatus.donePromise;

    const translateService = TestBed.inject(TranslateService);

    expect(translateService).toBeDefined();
    expect(translateService.tolgee).toBeDefined();
    expect(translateService.tolgee).not.toBeInstanceOf(Promise);
    expect(translateService.tolgee.isRunning()).toEqual(true);
    expect(translateService.tolgee.isLoaded()).toEqual(true);
    expect(translateService.instant('hello_world')).toContain(
      mockTranslations.en.hello_world
    );
  });
});
