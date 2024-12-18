import { TolgeeCore } from '../TolgeeCore';
import { TolgeeInstance } from '../types';
import { BackendPlugin, DevToolsPlugin } from './testTools';

describe('load required', () => {
  let tolgee: TolgeeInstance;

  beforeEach(async () => {
    tolgee = TolgeeCore()
      .use(DevToolsPlugin('.dev'))
      .use(BackendPlugin('.prod'))
      .init({
        language: 'en',
        apiKey: 'test',
        apiUrl: 'test',
      });
  });

  it('loads english and empty ns', async () => {
    const records = await tolgee.loadMatrix({
      languages: ['en'],
      namespaces: [''],
    });
    expect(records).toEqual([
      {
        cacheKey: 'en',
        data: { 'test.sub': 'en.default.dev' },
        language: 'en',
        namespace: '',
      },
    ]);
  });

  it('loads english and empty ns', async () => {
    const records = await tolgee.loadMatrix({
      languages: ['en'],
      namespaces: [''],
    });
    expect(records).toEqual([
      {
        cacheKey: 'en',
        data: { 'test.sub': 'en.default.dev' },
        language: 'en',
        namespace: '',
      },
    ]);
  });

  it('fails to load all namespaces when no availableNs specified', async () => {
    const promise = tolgee.loadMatrix({
      languages: ['en'],
      namespaces: 'all',
    });

    expect(() => promise).rejects.toThrow(
      "Tolgee: You need to specify 'availableNs' option"
    );
  });

  it('fails to load all languages when no availableLanguages specified', async () => {
    const promise = tolgee.loadMatrix({
      languages: 'all',
      namespaces: [''],
    });

    expect(() => promise).rejects.toThrow(
      "Tolgee: You need to specify 'availableLanguages' option"
    );
  });

  it('loads all dev', async () => {
    tolgee.updateOptions({
      availableLanguages: ['en'],
      availableNs: ['', 'test'],
    });
    const result = await tolgee.loadMatrix({
      languages: 'all',
      namespaces: 'all',
    });

    expect(result).toEqual([
      {
        cacheKey: 'en',
        data: { 'test.sub': 'en.default.dev' },
        language: 'en',
        namespace: '',
      },
      {
        cacheKey: 'en:test',
        data: { 'test.sub': 'en.test.dev' },
        language: 'en',
        namespace: 'test',
      },
    ]);
  });

  it('loads all prod', async () => {
    tolgee.updateOptions({
      availableLanguages: ['en'],
      availableNs: ['', 'test'],
    });
    const result = await tolgee.loadMatrix({
      languages: 'all',
      namespaces: 'all',
      noDev: true,
    });

    expect(result).toEqual([
      {
        cacheKey: 'en',
        data: { 'test.sub': 'en.default.prod' },
        language: 'en',
        namespace: '',
      },
      {
        cacheKey: 'en:test',
        data: { 'test.sub': 'en.test.prod' },
        language: 'en',
        namespace: 'test',
      },
    ]);
  });
});
