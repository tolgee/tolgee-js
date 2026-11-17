import { ListenerEvent, TreeTranslationsData } from '../../types';
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

  afterEach(() => {
    jest.restoreAllMocks();
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
  function deferred() {
    let resolve!: (value: TreeTranslationsData) => void;
    let reject!: (reason: Error) => void;
    const promise = new Promise<TreeTranslationsData>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }

  it('retries failed requests and shares both failed and recovered flights', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('temporary failure');
    const recovered = deferred();
    mockedBackendGetRecord
      .mockRejectedValueOnce(error)
      .mockReturnValueOnce(recovered.promise);

    const first = cache.loadRecords([{ language: 'en' }], { noDev: true });
    const duplicate = cache.loadRecords([{ language: 'en' }], { noDev: true });
    await Promise.all([
      expect(first).rejects.toThrow('Failed to fetch record'),
      expect(duplicate).rejects.toThrow('Failed to fetch record'),
    ]);
    expect(mockedBackendGetRecord).toBeCalledTimes(1);
    expect(cache.isFetching()).toBe(false);
    expect(cache.isLoading('en')).toBe(false);
    expect(onFetchingChange.mock.calls).toEqual([[true], [false]]);
    expect(onLoadingChange.mock.calls).toEqual([[true], [false]]);

    const retry = cache.loadRecords([{ language: 'en' }], { noDev: true });
    const sharedRetry = cache.loadRecords([{ language: 'en' }], {
      noDev: true,
    });
    expect(mockedBackendGetRecord).toBeCalledTimes(2);
    expect(cache.isFetching()).toBe(true);
    recovered.resolve({ greeting: 'Recovered' });
    const [result, sharedResult] = await Promise.all([retry, sharedRetry]);
    expect(result).toEqual(sharedResult);
    expect(cache.getRecord({ language: 'en' })?.data).toEqual({
      greeting: 'Recovered',
    });
    expect(cache.isFetching()).toBe(false);
    expect(onFetchingChange.mock.calls).toEqual([
      [true],
      [false],
      [true],
      [false],
    ]);
  });

  it('keeps a failed batch atomic while its other request is still pending', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const pending = deferred();
    mockedBackendGetRecord
      .mockReturnValueOnce(pending.promise)
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValue({ greeting: 'Recovered' });
    const batch = cache.loadRecords([{ language: 'en' }, { language: 'de' }], {
      noDev: true,
    });
    await expect(batch).rejects.toThrow('Failed to fetch record');
    expect(cache.getRecord({ language: 'en' })).toBeUndefined();
    expect(cache.getRecord({ language: 'de' })).toBeUndefined();
    expect(cache.isFetching()).toBe(true);
    expect(onFetchingChange.mock.calls).toEqual([[true]]);

    await cache.loadRecords([{ language: 'de' }], { noDev: true });
    expect(mockedBackendGetRecord).toBeCalledTimes(3);
    expect(cache.isFetching()).toBe(true);
    pending.resolve({ greeting: 'Discarded batch result' });
    // Flush settlement of the other request after its batch has rejected.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(cache.isFetching()).toBe(false);
    expect(cache.getRecord({ language: 'en' })).toBeUndefined();
    expect(onFetchingChange.mock.calls).toEqual([[true], [false]]);
    await cache.loadRecords([{ language: 'en' }], { noDev: true });
    expect(mockedBackendGetRecord).toBeCalledTimes(4);
    expect(cache.getRecord({ language: 'en' })?.data).toEqual({
      greeting: 'Recovered',
    });
  });

  it('applies a successful batch only after all records resolve', async () => {
    const first = deferred();
    const second = deferred();
    mockedBackendGetRecord
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const batch = cache.loadRecords([{ language: 'en' }, { language: 'de' }], {
      noDev: true,
    });
    first.resolve({ greeting: 'Hello' });
    await first.promise;
    await Promise.resolve();
    expect(cache.getAllRecords()).toEqual([]);
    expect(cache.isFetching()).toBe(true);
    second.resolve({ greeting: 'Hallo' });
    await batch;
    expect(cache.getRecord({ language: 'en' })?.data.greeting).toBe('Hello');
    expect(cache.getRecord({ language: 'de' })?.data.greeting).toBe('Hallo');
    expect(cache.isFetching()).toBe(false);
  });

  it.each(['resolve', 'reject'] as const)(
    'preserves the newer request when an invalidated flight settles via %s',
    async (settlement) => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const stale = deferred();
      const current = deferred();
      mockedBackendGetRecord
        .mockReturnValueOnce(stale.promise)
        .mockReturnValueOnce(current.promise);
      const old = cache.loadRecords([{ language: 'en' }], { noDev: true });
      const oldResult =
        settlement === 'reject'
          ? expect(old).rejects.toThrow('Failed to fetch record')
          : expect(old).resolves.toBeDefined();
      cache.invalidate();
      const fresh = cache.loadRecords([{ language: 'en' }], { noDev: true });
      if (settlement === 'reject') {
        stale.reject(new Error('stale failure'));
      } else {
        stale.resolve({ greeting: 'Stale' });
      }
      await oldResult;
      expect(cache.isFetching()).toBe(true);
      expect(cache.getRecord({ language: 'en' })).toBeUndefined();
      const shared = cache.loadRecords([{ language: 'en' }], { noDev: true });
      expect(mockedBackendGetRecord).toBeCalledTimes(2);
      current.resolve({ greeting: 'Current' });
      await Promise.all([fresh, shared]);
      expect(cache.getRecord({ language: 'en' })?.data.greeting).toBe(
        'Current'
      );
      expect(cache.isFetching()).toBe(false);
      expect(onFetchingChange.mock.calls).toEqual([[true], [false]]);
    }
  );

  it('applies a successful shared flight even when its original batch fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const shared = deferred();
    const failing = deferred();
    mockedBackendGetRecord
      .mockReturnValueOnce(shared.promise)
      .mockReturnValueOnce(failing.promise);
    const batch = cache.loadRecords([{ language: 'en' }, { language: 'de' }], {
      noDev: true,
    });
    const single = cache.loadRecords([{ language: 'en' }], { noDev: true });
    const rejected = expect(batch).rejects.toThrow('Failed to fetch record');
    failing.reject(new Error('temporary failure'));
    await rejected;
    expect(cache.isFetching()).toBe(true);
    shared.resolve({ greeting: 'Hello' });
    await single;
    expect(mockedBackendGetRecord).toBeCalledTimes(2);
    expect(cache.getRecord({ language: 'en' })?.data.greeting).toBe('Hello');
    expect(cache.getRecord({ language: 'de' })).toBeUndefined();
    expect(cache.isFetching()).toBe(false);
  });

  it('releases already fulfilled records in a failed batch without applying them', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const failing = deferred();
    cache.addStaticData({ cs: { greeting: 'Ahoj' } });
    mockedBackendGetRecord
      .mockResolvedValueOnce({ greeting: 'Discarded' })
      .mockReturnValueOnce(failing.promise)
      .mockResolvedValue({ greeting: 'Recovered' });
    const batch = cache.loadRecords(
      [{ language: 'cs' }, { language: 'en' }, { language: 'de' }],
      { noDev: true, useCache: true }
    );
    const rejected = expect(batch).rejects.toThrow('Failed to fetch record');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(cache.getRecord({ language: 'en' })).toBeUndefined();
    failing.reject(new Error('temporary failure'));
    await rejected;
    expect(cache.isFetching()).toBe(false);
    expect(cache.getRecord({ language: 'en' })).toBeUndefined();
    expect(cache.getRecord({ language: 'cs' })?.data.greeting).toBe('Ahoj');
    await cache.loadRecords([{ language: 'en' }, { language: 'de' }], {
      noDev: true,
      useCache: true,
    });
    expect(mockedBackendGetRecord).toBeCalledTimes(4);
    expect(cache.getRecord({ language: 'en' })?.data.greeting).toBe(
      'Recovered'
    );
    expect(cache.getRecord({ language: 'de' })?.data.greeting).toBe(
      'Recovered'
    );
  });
  it.each(['resolve', 'reject'] as const)(
    'observes late cleanup when a failed batch sibling settles via %s',
    async (settlement) => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const pending = deferred();
      mockedBackendGetRecord
        .mockReturnValueOnce(pending.promise)
        .mockRejectedValueOnce(new Error('temporary failure'))
        .mockResolvedValue({ greeting: 'Recovered' });
      onFetchingChange.mockImplementation((value) => {
        if (!value) {
          throw new Error('late observer settlement failure');
        }
      });
      const batch = cache.loadRecords(
        [{ language: 'en' }, { language: 'de' }],
        {
          noDev: true,
        }
      );
      await expect(batch).rejects.toThrow('Failed to fetch record');
      expect(cache.isFetching()).toBe(true);
      if (settlement === 'reject') {
        pending.reject(new Error('late loader failure'));
      } else {
        pending.resolve({ greeting: 'Discarded batch result' });
      }
      // Let the pending sibling finish after the public batch already failed.
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(cache.isFetching()).toBe(false);
      expect(cache.getRecord({ language: 'en' })).toBeUndefined();
      onFetchingChange.mockImplementation(() => {});
      await cache.loadRecords([{ language: 'en' }], { noDev: true });
      expect(mockedBackendGetRecord).toBeCalledTimes(3);
      expect(cache.getRecord({ language: 'en' })?.data.greeting).toBe(
        'Recovered'
      );
    }
  );
  it('releases every acquired request without waiting for a pending sibling after a start listener throws', async () => {
    const en = deferred();
    const de = deferred();
    mockedBackendGetRecord
      .mockReturnValueOnce(en.promise)
      .mockReturnValueOnce(de.promise);
    const error = new Error('start observer failure');
    onFetchingChange.mockImplementationOnce(() => {
      throw error;
    });
    const batch = cache.loadRecords([{ language: 'en' }, { language: 'de' }], {
      noDev: true,
    });
    await expect(batch).rejects.toBe(error);
    expect(cache.isFetching()).toBe(true);
    en.resolve({ greeting: 'Discarded' });
    await new Promise((done) => setTimeout(done, 0));
    expect(cache.isFetching()).toBe(true);
    expect(cache.isLoading('en')).toBe(true);
    expect(cache.getRecord({ language: 'en' })).toBeUndefined();
    de.resolve({ greeting: 'Discarded' });
    await new Promise((done) => setTimeout(done, 0));
    expect(cache.isFetching()).toBe(false);
    expect(cache.getAllRecords()).toEqual([]);
    expect(onLoadingChange.mock.calls).toEqual([[true], [false]]);
  });

  it('keeps a shared subset usable after its original batch start notification throws', async () => {
    const pending = deferred();
    mockedBackendGetRecord.mockReturnValue(pending.promise);
    const error = new Error('start observer failure');
    onFetchingChange.mockImplementationOnce(() => {
      throw error;
    });
    const failed = cache.loadRecords([{ language: 'en' }], { noDev: true });
    const subset = cache.loadRecords([{ language: 'en' }], { noDev: true });
    await expect(failed).rejects.toBe(error);
    expect(mockedBackendGetRecord).toBeCalledTimes(1);
    pending.resolve({ greeting: 'Hello' });
    await subset;
    expect(cache.getRecord({ language: 'en' })?.data.greeting).toBe('Hello');
    expect(cache.isFetching()).toBe(false);
  });

  it('releases a request when the loading start listener throws', async () => {
    const pending = deferred();
    mockedBackendGetRecord.mockReturnValue(pending.promise);
    const error = new Error('loading start failure');
    onLoadingChange.mockImplementationOnce(() => {
      throw error;
    });
    await expect(
      cache.loadRecords([{ language: 'en' }], { noDev: true })
    ).rejects.toBe(error);
    pending.resolve({ greeting: 'Discarded' });
    await new Promise((done) => setTimeout(done, 0));
    expect(cache.isFetching()).toBe(false);
    expect(cache.getAllRecords()).toEqual([]);
  });

  it.each(['batch', 'orphan'] as const)(
    'notifies loading when fetching notification throws during %s cleanup',
    async (kind) => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const pending = deferred();
      mockedBackendGetRecord
        .mockReturnValueOnce(pending.promise)
        .mockRejectedValueOnce(new Error('backend failure'));
      const error = new Error('fetching completion failure');
      onFetchingChange.mockImplementation((value) => {
        if (!value) throw error;
      });
      const batch = cache.loadRecords(
        kind === 'batch'
          ? [{ language: 'en' }]
          : [{ language: 'en' }, { language: 'de' }],
        { noDev: true }
      );
      const result =
        kind === 'batch'
          ? expect(batch).rejects.toBe(error)
          : expect(batch).rejects.toThrow('Failed to fetch record');
      if (kind === 'orphan') await result;
      pending.resolve({ greeting: 'Hello' });
      if (kind === 'batch') await result;
      await new Promise((done) => setTimeout(done, 0));
      expect(cache.isFetching()).toBe(false);
      expect(onLoadingChange.mock.calls).toEqual([[true], [false]]);
    }
  );
});
