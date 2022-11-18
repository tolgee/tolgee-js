import { render, RenderResult, screen } from '@testing-library/angular';
import { Tolgee } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';

import { NgxPlugin } from '../../lib/NgxPlugin';
import { NamespaceResolver } from '../../lib/namespace.resolver';
import { RootComponent } from './root.component';
import { wait } from '@tolgee/testing/wait';
import { NgxTolgeeModule } from '../../lib/ngx-tolgee.module';
import { TOLGEE_INSTANCE } from '../../lib/tolgee-instance-token';
import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';

let staticDataMock: ReturnType<typeof mockStaticDataAsync>;

let fixture: RenderResult<any>;

const getFixture = async ({ preloadedNs } = { preloadedNs: 'test' }) => {
  const tolgee = Tolgee().use(NgxPlugin()).use(FormatIcu()).init({
    staticData: staticDataMock.promises,
    language: 'cs',
    fallbackLanguage: 'en',
  });

  await tolgee.run();

  fixture = await render(RootComponent, {
    declarations: [],
    imports: [NgxTolgeeModule],
    providers: [
      {
        provide: TOLGEE_INSTANCE,
        useFactory: () => tolgee,
      },
    ],
    routes: [
      {
        path: '',
        children: [
          {
            path: 'lazy',
            loadChildren: () =>
              import('./lazy.module').then((c) => c.LazyModule),
            data: { tolgeeNamespace: preloadedNs },
            resolve: {
              _namespace: NamespaceResolver,
            },
          },
        ],
      },
    ],
  });

  return fixture;
};

describe('resolving', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    staticDataMock = mockStaticDataAsync();
    staticDataMock.resolvablePromises.en.resolve();
    staticDataMock.resolvablePromises.cs.resolve();
  });

  it('waits for namespace load before module is rendered', async () => {
    fixture = await getFixture();
    screen.queryByTestId('lazy-link').click();
    await wait(100);
    expect(screen.queryByTestId('loaded')).not.toBeInTheDocument();
    staticDataMock.resolvablePromises['en:test'].resolve();
    staticDataMock.resolvablePromises['cs:test'].resolve();
    await wait(100);
    expect(screen.queryByTestId('loaded')).toBeInTheDocument();
  });

  it('warns on undefined ns', async () => {
    fixture = await getFixture({ preloadedNs: undefined });
    // eslint-disable-next-line no-console
    console.warn = jest.fn();
    screen.queryByTestId('lazy-link').click();
    await wait(100);
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
