import '@testing-library/jest-dom';
import { render, RenderResult, screen } from '@testing-library/angular';
import { Tolgee, DevTools } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';

import { namespaceResolver } from '../lib/namespace.resolver';
import { RootComponent } from './fixtures/resolving/root.component';
import { wait } from '@tolgee/testing/wait';
import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';
import mockTranslations from '@tolgee/testing/mockTranslations';
import { provideTolgee } from '../lib/provide-tolgee';

const getFixture = async (
  { preloadedNs, staticDataMock } = {
    preloadedNs: 'test',
    staticDataMock: undefined as
      | ReturnType<typeof mockStaticDataAsync>
      | undefined,
  }
) => {
  return await render(RootComponent, {
    providers: [
      provideTolgee(() =>
        Tolgee()
          .use(DevTools())
          .use(FormatIcu())
          .init({
            language: 'en',
            fallbackLanguage: 'en',
            ...(staticDataMock && {
              staticData: staticDataMock.promises,
            }),
          })
      ),
    ],
    routes: [
      {
        path: '',
        children: [
          {
            path: 'lazy',
            loadComponent: () => import('./fixtures/resolving/lazy.component'),
            data: { tolgeeNamespace: preloadedNs },
            resolve: {
              _namespace: namespaceResolver,
            },
          },
        ],
      },
    ],
  });
};

describe('resolving', () => {
  let staticDataMock: ReturnType<typeof mockStaticDataAsync>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let fixture: RenderResult<any>;

  beforeEach(async () => {
    jest.clearAllMocks();
    staticDataMock = mockStaticDataAsync();
    staticDataMock.promises = {
      ...staticDataMock.promises,
      en: mockTranslations.en,
      cs: mockTranslations.cs,
    } as any;
  });

  it('waits for namespace load before module is rendered', async () => {
    fixture = await getFixture({ preloadedNs: 'test', staticDataMock });
    screen.queryByTestId('lazy-link').click();
    await wait(100);
    expect(screen.queryByTestId('loaded')).not.toBeInTheDocument();
    staticDataMock.resolvablePromises['en:test'].resolve();
    await wait(100);
    expect(screen.queryByTestId('loaded')).toBeInTheDocument();
  });

  it('warns on undefined ns', async () => {
    fixture = await getFixture({ preloadedNs: undefined, staticDataMock });
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    screen.queryByTestId('lazy-link').click();
    await wait(100);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });
});
