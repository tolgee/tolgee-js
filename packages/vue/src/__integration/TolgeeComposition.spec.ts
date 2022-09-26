jest.autoMockOff();

import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/vue';

import mockTranslations from './mockTranslations';
import { testConfig } from './testConfig';
import {
  useTranslate,
  TolgeeProvider,
  Tolgee,
  VuePlugin,
  TolgeeInstance,
  TolgeeVue,
} from '..';
import { IcuPlugin } from '@tolgee/icu-formatter';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = fetchMock.mockResponse(async (req) => {
  if (req.url.includes('/v2/api-keys/current')) {
    return JSON.stringify(testConfig);
  } else if (req.url.includes('/v2/projects/translations/en')) {
    return JSON.stringify({ en: mockTranslations.en });
  } else if (req.url.includes('/v2/projects/translations/cs')) {
    return JSON.stringify({ cs: mockTranslations.cs });
  }

  throw new Error('Invalid request');
});

const TestComponent = {
  template: `
    <div>
      <div data-testid="peter_dogs">
        {{ t("peter_dogs", { dogsCount: 5 }) }}
      </div>
      <div data-testid="hello_world">
        {{ t("hello_world") }}
      </div>
      <div data-testid="hello_world_no_wrap">
        {{ t({ key: "hello_world", noWrap: true }) }}
      </div>
      <div data-testid="non_existant">
        {{ t("non_existant", "Non existant") }}
      </div>
    </div>`,
  setup() {
    const { t } = useTranslate();
    return { t };
  },
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

describe('composition api', () => {
  let tolgee: TolgeeInstance;
  beforeEach(async () => {
    fetch.enableMocks();
    tolgee = Tolgee().use(VuePlugin()).use(IcuPlugin()).init({
      apiKey: API_KEY,
      apiUrl: API_URL,
      defaultLanguage: 'cs',
      fallbackLanguage: 'en',
    });

    render(WrapperComponent, {
      props: {
        tolgee,
        fallback: 'Loading...',
      },
      global: { plugins: [[TolgeeVue, { tolgee }]] },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Ahoj světe!'
      );
    });
  });

  afterEach(() => {
    tolgee.stop();
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
    waitFor(() => {
      expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
    });
  });

  describe('language switch', () => {
    beforeEach(async () => {
      tolgee.changeLanguage('en');
    });

    it('changes translation with tags', () => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Hello world!'
      );
      expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
    });
  });
});
