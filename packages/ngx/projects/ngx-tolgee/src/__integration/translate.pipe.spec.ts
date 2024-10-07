import '@testing-library/jest-dom';
import {
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/angular';
import { Tolgee, DevTools } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';

import { mockCoreFetch } from '@tolgee/testing/fetchMock';
import { NgxTolgeeModule } from '../lib/ngx-tolgee.module';
import { TOLGEE_INSTANCE } from '../lib/tolgee-instance-token';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = mockCoreFetch();
let fixture: RenderResult<any>;

const tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
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
        <div data-testid="peter_dogs">
          {{ 'peter_dogs' | translate:{ dogsCount: 5 } }}
        </div>
        <div data-testid="hello_world">
          {{ 'hello_world' | translate }}
        </div>
        <div data-testid="hello_world_no_wrap">
          {{ 'hello_world' | translate:{noWrap: true} }}
        </div>
        <div data-testid="non_existant">
          {{'non_existant' | translate:'Non existant' }}
        </div>
        <div
          data-testid="with_tags"
          innerHTML="{{'with_tags' | translate }}" >
        </div>
        <div data-testid="with_tags_disabled">
         {{'with_tags' | translate }}
        </div>
        <div data-testid="empty_key">
         {{'' | translate }}
        </div>
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

  it('empty key returns nothing', () => {
    expect(screen.queryByTestId('empty_key')).toContainHTML('');
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
      await tolgee.changeLanguage('en');
      await sleep(10); // wait while angular executes the the pipe
    });

    it('changes translation with tags', () => {
      expect(screen.queryByTestId('with_tags')).toContainHTML(
        'This <b>text <i>is</i> formatted</b>'
      );
      expect(screen.queryByTestId('with_tags')).toHaveAttribute('_tolgee');
    });
  });
});

const sleep = (timeout: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), timeout));
