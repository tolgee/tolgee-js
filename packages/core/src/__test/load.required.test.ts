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

  it('loads required records', async () => {
    const records = await tolgee.loadRequired();
    expect(records).toEqual([
      {
        cacheKey: 'en',
        data: { 'test.sub': 'en.default.dev' },
        language: 'en',
        namespace: '',
      },
    ]);
  });

  it('loads required records when language is passed through parameter', async () => {
    tolgee.updateOptions({ language: undefined });
    const noRecords = await tolgee.loadRequired();
    expect(noRecords).toEqual([]);
    const records = await tolgee.loadRequired({ language: 'en' });
    expect(records).toEqual([
      {
        cacheKey: 'en',
        data: { 'test.sub': 'en.default.dev' },
        language: 'en',
        namespace: '',
      },
    ]);
  });

  it('loads records with namespaces', async () => {
    tolgee.updateOptions({ defaultNs: 'namespace' });
    const records = await tolgee.loadRequired();
    expect(records).toEqual([
      {
        cacheKey: 'en:namespace',
        data: { 'test.sub': 'en.namespace.dev' },
        language: 'en',
        namespace: 'namespace',
      },
    ]);
  });

  it('loads records production', async () => {
    tolgee.updateOptions();
    const records = await tolgee.loadRequired({ noDev: true });
    expect(records).toEqual([
      {
        cacheKey: 'en',
        data: { 'test.sub': 'en.default.prod' },
        language: 'en',
        namespace: '',
      },
    ]);
  });
});
