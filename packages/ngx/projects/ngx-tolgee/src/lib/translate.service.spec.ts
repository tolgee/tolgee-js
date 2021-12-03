jest.dontMock('./translate.service');

import { TolgeeConfig } from '@tolgee/core';
import { TranslateService } from './translate.service';

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

jest.mock('@tolgee/core', () => {
  const Tolgee = jest.fn().mockImplementation(() => {
    const tolgee = {
      use: () => tolgee,
      init: () => tolgee,
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
    };
    return tolgee;
  });
  // @ts-ignore
  Tolgee.use = jest.fn().mockImplementation(() => new Tolgee());

  return {
    Tolgee,
  };
});

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
      runResolve?.();
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
    runResolve();
  });

  it('getSafe subscribes for events', (done) => {
    const observable = service.getSafe('test', { key: 'value' }, 'Default');
    observable.subscribe(() => {
      expect(langChangeSubscribeMock).toHaveBeenCalledTimes(2);
      expect(translationChangeSubscribeMock).toHaveBeenCalledTimes(2);

      done();
    });
    runResolve();
  });

  it('getSafe unsubscribes from events', (done) => {
    const observable = service.getSafe('test', { key: 'value' }, 'Default');
    const subscription = observable.subscribe(() => {
      expect(langChangeUnsubscribe).toHaveBeenCalledTimes(0);
      expect(translationChangeUnsubscribe).toHaveBeenCalledTimes(0);
      subscription.unsubscribe();
      expect(langChangeUnsubscribe).toHaveBeenCalledTimes(1);
      expect(translationChangeUnsubscribe).toHaveBeenCalledTimes(1);

      done();
    });

    runResolve();
  });

  it('get subscribes for events', (done) => {
    const observable = service.get('test', { key: 'value' }, 'Default');
    observable.subscribe(() => {
      expect(langChangeSubscribeMock).toHaveBeenCalledTimes(2); // one for start, one for the actual observable
      expect(translationChangeSubscribeMock).toHaveBeenCalledTimes(2); //one for start, one for the actual observable

      done();
    });
    runResolve();
  });

  it('get unsubscribes from events', (done) => {
    const observable = service.get('test', { key: 'value' }, 'Default');
    const subscription = observable.subscribe(() => {
      expect(langChangeUnsubscribe).toHaveBeenCalledTimes(0);
      expect(translationChangeUnsubscribe).toHaveBeenCalledTimes(0);
      subscription.unsubscribe();
      expect(langChangeUnsubscribe).toHaveBeenCalledTimes(1);
      expect(translationChangeUnsubscribe).toHaveBeenCalledTimes(1);

      done();
    });
    runResolve();
  });

  it('get works ', (done) => {
    const observable = service.get('test', { key: 'value' }, 'Default');
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
    runResolve();
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
