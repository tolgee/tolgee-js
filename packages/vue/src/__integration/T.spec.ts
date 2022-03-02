jest.autoMockOff();

import fetchMock from 'jest-fetch-mock';
import { Tolgee } from '@tolgee/core';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/vue';

import mockTranslations from './mockTranslations';
import { testConfig } from './testConfig';
import { TolgeeProvider, T, TolgeeMixin } from '..';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

let tolgee: Tolgee;

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
  mixins: [TolgeeMixin],
  components: { T },
  template: `
    <div>
      <div data-testid="peter_dogs">
        <T keyName="peter_dogs" :parameters="{ dogsCount: 5 }" />
      </div>
      <div data-testid="hello_world">
        <T keyName="hello_world" />
      </div>
      <div data-testid="hello_world_no_wrap">
        <T keyName="hello_world" noWrap />
      </div>
      <div data-testid="non_existant">
        <T keyName="non_existant" defaultValue="Non existant" />
      </div>
    </div>`,
  mounted() {
    tolgee = this.tolgeeContext.tolgee;
  },
};

const WrapperComponent = {
  components: { TestComponent, TolgeeProvider },
  template: `
    <TolgeeProvider
      :config="config"
    >
      <TestComponent />
    </TolgeeProvider>
  `,
  props: ['config'],
};

describe('T component integration', () => {
  beforeEach(async () => {
    fetch.enableMocks();

    render(WrapperComponent, {
      props: {
        config: {
          apiKey: API_KEY,
          apiUrl: API_URL,
          defaultLanguage: 'cs',
          fallbackLanguage: 'en',
        },
        loadingFallback: 'Loading...',
      },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Ahoj světe!'
      );
    });
  });

  it('wraps translation correctly', async () => {
    expect(screen.queryByTestId('hello_world').innerHTML).toContain(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world')).toHaveProperty('_tolgee');
  });

  it('works with no wrap', () => {
    expect(screen.queryByTestId('hello_world_no_wrap').innerHTML).toContain(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveProperty(
      '_tolgee'
    );
  });

  it('works with parameters', () => {
    expect(screen.queryByTestId('peter_dogs').innerHTML).toContain(
      'Petr má 5 psů.'
    );
    expect(screen.queryByTestId('peter_dogs')).toHaveProperty('_tolgee');
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant').innerHTML).toContain(
      'Non existant'
    );
    expect(screen.queryByTestId('non_existant')).toHaveProperty('_tolgee');
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await tolgee.changeLanguage('en');
    });

    it('changes translation with tags', () => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Hello world!'
      );
      expect(screen.queryByTestId('hello_world')).toHaveProperty('_tolgee');
    });
  });
});
