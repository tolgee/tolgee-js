import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/vue';

import {
  TolgeeProvider,
  T,
  TolgeeInstance,
  Tolgee,
  DevTools,
  useTranslate,
  VueTolgee,
} from '..';
import { FormatIcu } from '@tolgee/format-icu';
import { mockCoreFetch } from '@tolgee/testing/fetchMock';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = mockCoreFetch();

const setTitle = jest.fn();

const TestComponent = {
  components: { T },
  setup() {
    const { t } = useTranslate();

    setTitle(t.value('hello_world', { noWrap: true }));

    return { t };
  },
  template: `
    <div>
      <div data-testid="peter_dogs">
        {{ t("peter_dogs", { dogsCount: 5 }) }}
      </div>
      <div data-testid="hello_world">
        {{ t("hello_world") }}
      </div>
      <div data-testid="hello_world_no_wrap">
        {{ t("hello_world", { noWrap: true }) }}
      </div>
      <div data-testid="non_existant">
        {{ t("non_existant", "Non existant") }}
      </div>
    </div>`,
};

const WrapperComponent = {
  components: { TestComponent, TolgeeProvider },
  template: `
    <TolgeeProvider
      :tolgee="tolgee"
    >
      <TestComponent />
    </TolgeeProvider>
  `,
  props: ['tolgee'],
};

describe('T component integration', () => {
  let tolgee: TolgeeInstance;

  beforeEach(async () => {
    fetch.enableMocks();

    tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
      apiUrl: API_URL,
      apiKey: API_KEY,
      language: 'cs',
      fallbackLanguage: 'en',
    });

    render(WrapperComponent, {
      props: {
        tolgee,
        fallback: 'Loading...',
      },
      global: { plugins: [[VueTolgee, { tolgee }]] },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Ahoj světe!'
      );
    });
  });

  it('t function can be called in setup function', async () => {
    expect(setTitle).toBeCalledWith('Ahoj světe!');
  });

  it('wraps translation correctly', async () => {
    expect(screen.queryByTestId('hello_world').innerHTML).toContain(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
  });

  it('works with no wrap', () => {
    expect(screen.queryByTestId('hello_world_no_wrap').innerHTML).toContain(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveAttribute(
      '_tolgee'
    );
  });

  it('works with parameters', () => {
    expect(screen.queryByTestId('peter_dogs').innerHTML).toContain(
      'Petr má 5 psů.'
    );
    expect(screen.queryByTestId('peter_dogs')).toHaveAttribute('_tolgee');
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant').innerHTML).toContain(
      'Non existant'
    );
    expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await tolgee.changeLanguage('en');
    });

    it('changes translation with tags', () => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Hello world!'
      );
      expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
    });
  });
});
