import { TolgeeCore } from '@tolgee/core';
import { createFetchingUtility } from './fetchingUtillity';
import { DevBackend } from '../DevBackend';

describe('can handle relative urls in apiUrl', () => {
  let f: ReturnType<typeof createFetchingUtility>;

  beforeEach(() => {
    f = createFetchingUtility();
  });

  it('dev backend can resolve relative urls', async () => {
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: '/test',
        apiKey: 'test',
      });
    await expect(tolgee.loadRecord({ language: 'en' })).resolves.toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const args = fetchMock.mock.calls[0] as any;
    expect(args[0]).toEqual(
      'http://localhost/test/v2/projects/translations/en'
    );
  });

  it('dev backend can resolve apiUrl with included path', async () => {
    const fetchMock = f.fetchWithResponse({});
    const tolgee = TolgeeCore()
      .use(DevBackend())
      .init({
        language: 'en',
        availableLanguages: ['en'],
        fetch: fetchMock,
        apiUrl: 'https://test.com/abcd',
        apiKey: 'test',
      });
    await expect(tolgee.loadRecord({ language: 'en' })).resolves.toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const args = fetchMock.mock.calls[0] as any;
    expect(args[0]).toEqual(
      'https://test.com/abcd/v2/projects/translations/en'
    );
  });
});
