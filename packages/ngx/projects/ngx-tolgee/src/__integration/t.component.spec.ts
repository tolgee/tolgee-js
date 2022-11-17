import {
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/angular';
import { act } from 'react-dom/test-utils';
import { Tolgee } from '@tolgee/web';
import { NgxPlugin } from '../lib/NgxPlugin';
import { FormatIcu } from '@tolgee/format-icu';
import { mockCoreFetch } from '@testing/fetchMock';
import { TOLGEE_INSTANCE } from '../lib/tolgee-instance-token';
import { NgxTolgeeModule } from '../lib/ngx-tolgee.module';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = mockCoreFetch();

let fixture: RenderResult<any>;

const tolgee = Tolgee().use(NgxPlugin()).use(FormatIcu()).init({
  apiUrl: API_URL,
  apiKey: API_KEY,
  language: 'cs',
  fallbackLanguage: 'en',
});

const getFixture = async (html: string) => {
  await tolgee.run();

  fixture = await render(html, {
    imports: [NgxTolgeeModule],
    providers: [
      {
        provide: TOLGEE_INSTANCE,
        useFactory: () => tolgee,
      },
    ],
  });

  await waitFor(() => {
    expect(screen.queryByTestId('hello_world')?.textContent).toContain(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world')).toHaveAttribute(
      '_tolgee',
      'true'
    );
  });
  return fixture;
};

describe('t component', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetch.enableMocks();
    fixture = await getFixture(`
        <div t key="peter_dogs" [params]="{ dogsCount: 5 }" data-testid="peter_dogs"></div>
        <div t key="hello_world" data-testid="hello_world">
        </div>
        <div t key="hello_world" data-testid="hello_world_no_wrap" [noWrap]="true">
        </div>
        <div t key="non_existant" data-testid="non_existant" default="Non existant">
        </div>
        <div t key="with_tags" data-testid="with_tags" [isHtml]="true"></div>
        <div t key="with_tags" data-testid="with_tags_disabled"></div>
       `);
  });

  it('wraps translation correctly', async () => {
    expect(screen.queryByTestId('hello_world')).toContainHTML('Ahoj světe!');
    expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
  });

  it('works with no wrap', () => {
    expect(screen.queryByTestId('hello_world_no_wrap')).toContainHTML(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveAttribute(
      '_tolgee'
    );
  });

  it('works with parameters', () => {
    expect(screen.queryByTestId('peter_dogs')).toContainHTML('Petr má 5 psů.');
    expect(screen.queryByTestId('peter_dogs')).toHaveAttribute('_tolgee');
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant')).toContainHTML('Non existant');
    expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
  });

  it('works with tags', () => {
    expect(screen.queryByTestId('with_tags')).toContainHTML(
      'Tento <b>text <i>je</i> formátovaný</b>'
    );
    expect(screen.queryByTestId('with_tags')).toHaveAttribute('_tolgee');
  });

  it('works with tags disabled', () => {
    const content = 'Tento <b>text <i>je</i> formátovaný</b>';
    expect(screen.queryByTestId('with_tags_disabled')).toHaveTextContent(
      content
    );
    expect(screen.queryByTestId('with_tags_disabled')).not.toContainHTML(
      content
    );
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await act(async () => {
        await tolgee.changeLanguage('en');
      });
    });

    it('changes translation with tags', () => {
      expect(screen.queryByTestId('with_tags')).toContainHTML(
        'This <b>text <i>is</i> formatted</b>'
      );
      expect(screen.queryByTestId('with_tags')).toHaveAttribute('_tolgee');
    });
  });
});
