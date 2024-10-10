import { createBackendFetch } from './BackendFetch';
import { createFetchingUtility } from './__test__/fetchingUtillity';

describe('backend fetch', () => {
  let f: ReturnType<typeof createFetchingUtility>;

  beforeEach(() => {
    f = createFetchingUtility();
  });

  it('calls fetch with correct params', () => {
    const plugin = createBackendFetch();
    plugin.getRecord({ fetch: f.fetchMock, language: 'de' });
    expect(f.fetchMock).toHaveBeenCalledWith(
      '/i18n/de.json',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
  });

  it('calls fetch with custom prefix', () => {
    const plugin = createBackendFetch({ prefix: 'http://test.com/test' });
    plugin.getRecord({ fetch: f.fetchMock, language: 'de', namespace: 'ns' });
    expect(f.fetchMock).toHaveBeenCalledWith(
      'http://test.com/test/ns/de.json',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
  });

  it('handles extra slash', () => {
    const plugin = createBackendFetch({ prefix: 'http://test.com/test/' });
    plugin.getRecord({ fetch: f.fetchMock, language: 'de' });
    expect(f.fetchMock).toHaveBeenCalledWith(
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
    plugin.getRecord({ fetch: f.fetchMock, language: 'de' });
    expect(f.fetchMock).toHaveBeenCalledWith(
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
    plugin.getRecord({ fetch: f.fetchMock, language: 'de' });
    expect(f.fetchMock).toHaveBeenCalledWith(
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
      plugin.getRecord({ fetch: f.infiniteFetch, language: 'de' })
    ).rejects.toHaveProperty(
      'message',
      'TIMEOUT: http://test.com/test/de.json'
    );

    expect(f.infiniteFetch).toHaveBeenCalledWith(
      'http://test.com/test/de.json',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
    expect(f.signalHandler).toHaveBeenCalledWith('Aborted with signal');
  });

  it('throws the original error', async () => {
    const plugin = createBackendFetch({
      prefix: 'http://test.com/test/',
    });
    expect(
      plugin.getRecord({ fetch: f.failingFetch, language: 'de' })
    ).rejects.toHaveProperty('message', 'Fetch failed');
  });

  it('returns undefined when `fallbackOnFail`', async () => {
    const plugin = createBackendFetch({
      prefix: 'http://test.com/test/',
      fallbackOnFail: true,
    });
    expect(
      await plugin.getRecord({ fetch: f.failingFetch, language: 'de' })
    ).toEqual(undefined);
  });

  it('returns undefined when `fallbackOnFail` and timeout', async () => {
    const plugin = createBackendFetch({
      prefix: 'http://test.com/test/',
      fallbackOnFail: true,
      timeout: 5,
    });
    expect(
      await plugin.getRecord({ fetch: f.infiniteFetch, language: 'de' })
    ).toEqual(undefined);
    expect(f.signalHandler).toHaveBeenCalledWith('Aborted with signal');
  });
});
