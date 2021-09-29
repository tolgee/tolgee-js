jest.dontMock('./translate.service');

let runResolve;
let initialLoading;
const stopMock = jest.fn();
const runMock = jest.fn(
  () =>
    new Promise((resolve) => {
      runResolve = resolve;
    })
);

const langChangeUnsubscribe = jest.fn();
const translationChangeUnsubscribe = jest.fn();

let langChangeCallback;
const langChangeSubscribeMock = jest.fn((cb) => {
  langChangeCallback = cb;
  return {
    unsubscribe: langChangeUnsubscribe,
  };
});

let translationChangeCallback;
const translationChangeSubscribeMock = jest.fn((cb) => {
  translationChangeCallback = cb;
  return {
    unsubscribe: translationChangeUnsubscribe,
  };
});

let setLangMock = jest.fn();
let translateMock = jest.fn().mockResolvedValue('translated');
let instantMock = jest.fn(() => 'translated instant');

jest.mock('@tolgee/core', () => ({
  Tolgee: jest.fn().mockImplementation(() => ({
    run: runMock,
    stop: stopMock,
    initialLoading: initialLoading,
    onLangChange: {
      subscribe: langChangeSubscribeMock,
    },
    onTranslationChange: {
      subscribe: translationChangeSubscribeMock,
    },
    set lang(lang: string) {
      setLangMock(lang);
    },
    translate: translateMock,
    instant: instantMock,
  })),
}));

import { TolgeeConfig } from '@tolgee/core';
import { TranslateService } from './translate.service';

describe('Translate service', function () {
  let service: TranslateService;
  let config = {} as TolgeeConfig;
  beforeEach(async () => {
    jest.clearAllMocks();
    service = new TranslateService(config);
  });

  describe('start method', () => {
    beforeEach(() => {
      service.start({}).then(() => {});
      runResolve();
    });

    it('starts tolgee', async () => {
      expect(runMock).toHaveBeenCalledTimes(1);
    });

    it('subscribes for translation change', async () => {
      expect(runMock).toHaveBeenCalledTimes(1);
    });

    it('subscribes for lang change', async () => {
      expect(langChangeSubscribeMock).toHaveBeenCalledTimes(1);
    });

    it('subscribes for translation change', async () => {
      expect(translationChangeSubscribeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('on destroy', () => {
    beforeEach(() => {
      service.start({});
      runResolve();
      service.ngOnDestroy();
    });

    it('stops tolgee', async () => {
      expect(stopMock).toHaveBeenCalledTimes(1);
    });

    it('unsubscribes for translation change', async () => {
      expect(translationChangeUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('unsubscribes for lang change', async () => {
      expect(langChangeUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  it('setLangMethod sets the lang', () => {
    service.start({});
    runResolve();
    service.setLang('aaa');
    expect(setLangMock).toHaveBeenCalledWith('aaa');
  });

  it('getSafe works ', (done) => {
    const observable = service.getSafe('test', { key: 'value' }, 'Default');
    runResolve();
    observable.subscribe((r) => {
      expect(r).toEqual('translated');
      expect(translateMock).toHaveBeenCalledWith(
        'test',
        { key: 'value' },
        true,
        'Default'
      );
      done();
    });
  });

  it('get works ', (done) => {
    const observable = service.get('test', { key: 'value' }, 'Default');
    runResolve();
    observable.subscribe((r) => {
      expect(r).toEqual('translated');
      expect(translateMock).toHaveBeenCalledWith(
        'test',
        { key: 'value' },
        false,
        'Default'
      );
      done();
    });
  });

  it('instant works ', () => {
    service.start({});
    runResolve();
    const r = service.instant('test', { key: 'value' }, 'Default');
    expect(r).toEqual('translated instant');
    expect(instantMock).toHaveBeenCalledWith(
      'test',
      { key: 'value' },
      undefined,
      undefined,
      'Default'
    );
  });

  it('instantSage works ', () => {
    service.start({});
    runResolve();
    const r = service.instantSafe('test', { key: 'value' }, 'Default');
    expect(r).toEqual('translated instant');
    expect(instantMock).toHaveBeenCalledWith(
      'test',
      { key: 'value' },
      true,
      undefined,
      'Default'
    );
  });
});
