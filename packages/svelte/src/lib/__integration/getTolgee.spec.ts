import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/svelte';

import TestGetTolgee from './components/TestGetTolgee.svelte';
import { Tolgee, type TolgeeInstance } from '@tolgee/web';
import { SveltePlugin } from '$lib/SveltePlugin';

describe('getTranslate', () => {
  let tolgee: TolgeeInstance;
  beforeEach(async () => {
    tolgee = Tolgee().use(SveltePlugin()).init({
      language: 'en',
    });

    render(TestGetTolgee);
  });

  it('reactivity works as expected', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('language-reactive').innerHTML).toContain(
        'en'
      );
      expect(screen.queryByTestId('language-non-reactive').innerHTML).toContain(
        'en'
      );
    });

    await tolgee.changeLanguage('de');

    await waitFor(() => {
      expect(screen.queryByTestId('language-reactive').innerHTML).toContain(
        'de'
      );
      expect(screen.queryByTestId('language-non-reactive').innerHTML).toContain(
        'en'
      );
    });
  });
});
