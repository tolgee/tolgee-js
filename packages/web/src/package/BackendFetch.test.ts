import { FetchFn } from '@tolgee/core';
import { createBackendFetch } from './BackendFetch';

describe('backend fetch', () => {
  let fetchMock: FetchFn;
  let infiniteFetch: FetchFn;
  let failingFetch: FetchFn;
  let signalHandler: jest.Mock;

  beforeEach(() => {
    signalHandler = jest.fn();
    fetchMock = jest.fn(() =>
      Promise.resolve({
        json: () => ({
          status: 'ok',
        }),
        ok: true,
      } as unknown as Response)
    );

    infiniteFetch = jest.fn(
      (_, { signal }: RequestInit) =>
        new Promise(() => {
          signal.addEventListener('abort', () =>
            signalHandler('Aborted with signal')
          );
        })
    );
    failingFetch = jest.fn(() => Promise.reject(new Error('Fetch failed')));
  });

  it('calls fetch with correct params', () => {
    const plugin = createBackendFetch();
    plugin.getRecord({ fetch: fetchMock, language: 'de' });
    expect(fetchMock).toHaveBeenCalledWith(
      '/i18n/de.json',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
  });

  it('calls fetch with custom prefix', () => {
    const plugin = createBackendFetch({ prefix: 'http://test.com/test' });
    plugin.getRecord({ fetch: fetchMock, language: 'de', namespace: 'ns' });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://test.com/test/ns/de.json',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
  });

  it('handles extra slash', () => {
    const plugin = createBackendFetch({ prefix: 'http://test.com/test/' });
    plugin.getRecord({ fetch: fetchMock, language: 'de' });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://test.com/test/de.json',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
  });

  it('adds headers', () => {
    const plugin = createBackendFetch({
      prefix: 'http://test.com/test/',
      headers: { Authorization: 'test' },
    });
    plugin.getRecord({ fetch: fetchMock, language: 'de' });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://test.com/test/de.json',
      expect.objectContaining({
        headers: { Accept: 'application/json', Authorization: 'test' },
      })
    );
  });

  it('passes additional properties', () => {
    const plugin = createBackendFetch({
      prefix: 'http://test.com/test/',
      cache: 'no-cache',
    });
    plugin.getRecord({ fetch: fetchMock, language: 'de' });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://test.com/test/de.json',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
        cache: 'no-cache',
      })
    );
  });

  it('fails with a timeout', async () => {
    const plugin = createBackendFetch({
      prefix: 'http://test.com/test/',
      timeout: 5,
    });
    await expect(
      plugin.getRecord({ fetch: infiniteFetch, language: 'de' })
    ).rejects.toHaveProperty(
      'message',
      'TIMEOUT: http://test.com/test/de.json'
    );

    expect(infiniteFetch).toHaveBeenCalledWith(
      'http://test.com/test/de.json',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
    expect(signalHandler).toHaveBeenCalledWith('Aborted with signal');
  });

  it('throws the original error', async () => {
    const plugin = createBackendFetch({
      prefix: 'http://test.com/test/',
    });
    expect(
      plugin.getRecord({ fetch: failingFetch, language: 'de' })
    ).rejects.toHaveProperty('message', 'Fetch failed');
  });

  it('returns undefined when `fallbackOnFail`', async () => {
    const plugin = createBackendFetch({
      prefix: 'http://test.com/test/',
      fallbackOnFail: true,
    });
    expect(
      await plugin.getRecord({ fetch: failingFetch, language: 'de' })
    ).toEqual(undefined);
  });

  it('returns undefined when `fallbackOnFail` and timeout', async () => {
    const plugin = createBackendFetch({
      prefix: 'http://test.com/test/',
      fallbackOnFail: true,
      timeout: 5,
    });
    expect(
      await plugin.getRecord({ fetch: infiniteFetch, language: 'de' })
    ).toEqual(undefined);
    expect(signalHandler).toHaveBeenCalledWith('Aborted with signal');
  });
});
