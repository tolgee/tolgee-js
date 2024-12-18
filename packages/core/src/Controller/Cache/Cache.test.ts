import { ListenerEvent } from '../../types';
import { EventEmitterInstance } from '../Events/EventEmitter';
import { ValueObserver } from '../ValueObserver';
import { Cache, CacheInstance } from './Cache';

describe('cache', () => {
  function createEventMock(): EventEmitterInstance<ListenerEvent<any, any>> {
    return {
      emit: jest.fn(),
      listen: jest.fn(),
    };
  }

  let mockedBackendGetRecord: jest.Mock<any, any>;
  let mockedBackendGetDevRecord: jest.Mock<any, any>;

  let onFetchingChange: jest.Mock<any, any>;
  let onLoadingChange: jest.Mock<any, any>;

  let cache: CacheInstance;

  beforeEach(() => {
    const mockedEvents = {
      on: jest.fn(),
      onCacheChange: createEventMock(),
      onError: createEventMock(),
      onFetchingChange: createEventMock(),
      onInitialLoaded: createEventMock(),
      onLanguageChange: createEventMock(),
      onLoadingChange: createEventMock(),
      onPendingLanguageChange: createEventMock(),
      onPermanentChange: createEventMock(),
      onRunningChange: createEventMock(),
      onUpdate: createEventMock() as any,
      setEmitterActive: jest.fn(),
    };

    mockedBackendGetRecord = jest.fn((args) => {
      return Promise.resolve({ data: 'Prod', ...args });
    });
    mockedBackendGetDevRecord = jest.fn((args) => {
      return Promise.resolve({ data: 'Dev', ...args });
    });

    onFetchingChange = jest.fn();
    onLoadingChange = jest.fn();

    const fetchingObserver = ValueObserver(
      false,
      () => cache.isFetching(),
      onFetchingChange
    );

    const loadingObserver = ValueObserver(
      false,
      () => cache.isLoading('en'),
      onLoadingChange
    );

    cache = Cache(
      mockedEvents,
      mockedBackendGetRecord,
      mockedBackendGetDevRecord,
      (descriptor) => ({ namespace: '', ...descriptor }),
      () => false,
      fetchingObserver,
      loadingObserver
    );
  });

  it('fetches language with default namespace', async () => {
    const result = await cache.loadRecords([{ language: 'en' }]);
    expect(result[0].data).toEqual({
      language: 'en',
      namespace: '',
      data: 'Dev',
    });
  });

  it('fetches language with specified namespace', async () => {
    const result = await cache.loadRecords([
      { language: 'en', namespace: 'test' },
    ]);
    expect(result[0].data).toEqual({
      language: 'en',
      namespace: 'test',
      data: 'Dev',
    });
  });

  it('fetches language with specified namespace', async () => {
    const result = await cache.loadRecords([
      { language: 'en', namespace: 'test' },
    ]);
    expect(result[0].data).toEqual({
      language: 'en',
      namespace: 'test',
      data: 'Dev',
    });
  });

  it('uses cache when fetching twice the same thing', async () => {
    await cache.loadRecords([{ language: 'en' }]);
    expect(mockedBackendGetDevRecord).toBeCalledTimes(1);
    const result = await cache.loadRecords([{ language: 'en' }], {
      useCache: true,
    });
    expect(mockedBackendGetDevRecord).toBeCalledTimes(1);
    expect(result[0].data).toEqual({
      language: 'en',
      namespace: '',
      data: 'Dev',
    });
  });

  it('uses cache when fetching twice production data', async () => {
    await cache.loadRecords([{ language: 'en' }], { noDev: true });
    expect(mockedBackendGetRecord).toBeCalledTimes(1);
    const result = await cache.loadRecords([{ language: 'en' }], {
      noDev: true,
      useCache: true,
    });
    expect(mockedBackendGetRecord).toBeCalledTimes(1);
    expect(result[0].data).toEqual({
      language: 'en',
      namespace: '',
      data: 'Prod',
    });
  });

  it('does not use cache when `noCache` is on', async () => {
    await cache.loadRecords([{ language: 'en' }]);
    expect(mockedBackendGetDevRecord).toBeCalledTimes(1);
    await cache.loadRecords([{ language: 'en' }]);
    expect(mockedBackendGetDevRecord).toBeCalledTimes(2);
  });

  it('correctly returns combination of non-cached and cached', async () => {
    await cache.loadRecords([{ language: 'en' }]);
    expect(mockedBackendGetDevRecord).toBeCalledTimes(1);
    const result = await cache.loadRecords(
      [{ language: 'en' }, { language: 'en', namespace: 'new' }],
      { useCache: true }
    );
    expect(mockedBackendGetDevRecord).toBeCalledTimes(2);
    expect(result).toEqual([
      {
        cacheKey: 'en',
        data: { data: 'Dev', language: 'en', namespace: '' },
        language: 'en',
        namespace: '',
      },
      {
        cacheKey: 'en:new',
        data: { data: 'Dev', language: 'en', namespace: 'new' },
        language: 'en',
        namespace: 'new',
      },
    ]);
  });

  it('correctly refetches dev data', async () => {
    await cache.loadRecords([{ language: 'en' }], { noDev: true });
    expect(mockedBackendGetRecord).toBeCalledTimes(1);
    expect(mockedBackendGetDevRecord).toBeCalledTimes(0);
    cache.invalidate();
    const result = await cache.loadRecords([{ language: 'en' }]);
    expect(mockedBackendGetRecord).toBeCalledTimes(1);
    expect(mockedBackendGetDevRecord).toBeCalledTimes(1);
    expect(result[0].data).toEqual({
      language: 'en',
      namespace: '',
      data: 'Dev',
    });
  });

  it('correctly notifies about fetching and loading', async () => {
    expect(onLoadingChange).toBeCalledTimes(0);
    expect(onFetchingChange).toBeCalledTimes(0);
    await cache.loadRecords([{ language: 'en' }]);
    expect(onLoadingChange).toBeCalledTimes(2);
    expect(onFetchingChange).toBeCalledTimes(2);
    cache.invalidate();
    await cache.loadRecords([{ language: 'en' }]);
    expect(onFetchingChange).toBeCalledTimes(4);
    expect(onLoadingChange).toBeCalledTimes(2);
  });
});
