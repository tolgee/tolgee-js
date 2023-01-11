jest.autoMockOff();

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/vue';

import {
  TolgeeProvider,
  TolgeeInstance,
  Tolgee,
  DevTools,
  VueTolgee,
} from '..';
import { FormatIcu } from '@tolgee/format-icu';
import { mockCoreFetchAsync } from '@tolgee/testing/fetchMock';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const TestComponent = {
  template: `
    <div>
      <div data-testid="hello_world">
        {{ $t("hello_world") }}
      </div>
      <div data-testid="english_fallback">
        {{ $t('english_fallback', 'Default value') }}
      </div>
      <div data-testid="non_existant">
        {{ $t("non_existant", "Default value") }}
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

describe('TolgeeProvider integration', () => {
  let tolgee: TolgeeInstance;

  describe('regular settings', () => {
    let resolveEnglish;
    let resolveCzech;
    beforeEach(async () => {
      const fetchMock = mockCoreFetchAsync();
      resolveCzech = fetchMock.csTranslations.resolve;
      resolveEnglish = fetchMock.enTranslations.resolve;
      fetchMock.fetch.enableMocks();

      tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
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
        global: { plugins: [[VueTolgee, { tolgee }]] },
      });
    });

    it('shows correctly loading, fallback and default value', async () => {
      await waitFor(() => {
        expect(screen.queryByText('Loading...')?.innerHTML).toContain(
          'Loading...'
        );
      });
      resolveCzech();
      await waitFor(() => {
        expect(screen.queryByText('Loading...')?.innerHTML).toContain(
          'Loading...'
        );
      });
      resolveEnglish();
      await waitFor(() => {
        expect(screen.queryByTestId('hello_world').innerHTML).toContain(
          'Ahoj světe!'
        );
        expect(screen.queryByTestId('english_fallback').innerHTML).toContain(
          'English fallback'
        );
        expect(screen.queryByTestId('non_existant').innerHTML).toContain(
          'Default value'
        );
      });
    });
  });
});
