import { TolgeeCore } from '@tolgee/core';
import { createFetchingUtility } from './fetchingUtillity';
import { BackendFetch } from '../BackendFetch';

describe('tolgee with fallback backend fetch', () => {
  let f: ReturnType<typeof createFetchingUtility>;

  beforeEach(() => {
    f = createFetchingUtility();
  });

  it('fallback works with backend fetch', async () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const tolgee = TolgeeCore()
      .use(BackendFetch({ prefix: '1', timeout: 2, fallbackOnFail: true }))
      .use(BackendFetch({ prefix: '2', timeout: 2, fallbackOnFail: true }))
      .use(BackendFetch({ prefix: '3', timeout: 2, fallbackOnFail: false }))
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: f.infiniteFetch,
      });
    await expect(tolgee.loadRecord({ language: 'en' })).rejects.toHaveProperty(
      'message',
      'Tolgee: Failed to fetch record for "en"'
    );
    expect(f.infiniteFetch).toHaveBeenCalledTimes(3);
  });

  it('fallback works when all backend fetch plugins fail', async () => {
    const tolgee = TolgeeCore()
      .use(BackendFetch({ prefix: '1', timeout: 2, fallbackOnFail: true }))
      .use(BackendFetch({ prefix: '2', timeout: 2, fallbackOnFail: true }))
      .use(BackendFetch({ prefix: '3', timeout: 2, fallbackOnFail: true }))
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: f.infiniteFetch,
      });
    await expect(tolgee.loadRecord({ language: 'en' })).resolves.toEqual({});
    expect(f.infiniteFetch).toHaveBeenCalledTimes(3);
  });

  it('fallback works with static data', async () => {
    const tolgee = TolgeeCore()
      .use(BackendFetch({ prefix: '1', timeout: 2, fallbackOnFail: true }))
      .use(BackendFetch({ prefix: '2', timeout: 2, fallbackOnFail: true }))
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: f.infiniteFetch,
        staticData: {
          en: { test: 'test' },
        },
      });
    await expect(tolgee.loadRecord({ language: 'en' })).resolves.toEqual({
      test: 'test',
    });
    expect(f.infiniteFetch).toHaveBeenCalledTimes(2);
  });

  it('fallback works with dynamic static data', async () => {
    const tolgee = TolgeeCore()
      .use(BackendFetch({ prefix: '1', timeout: 2, fallbackOnFail: true }))
      .use(BackendFetch({ prefix: '2', timeout: 2, fallbackOnFail: true }))
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: f.infiniteFetch,
        staticData: {
          en: () => Promise.resolve({ test: 'test' }),
        },
      });
    await expect(tolgee.loadRecord({ language: 'en' })).resolves.toEqual({
      test: 'test',
    });
    expect(f.infiniteFetch).toHaveBeenCalledTimes(2);
  });
});
