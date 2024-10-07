import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/svelte';

import TestProviderComponent from './components/TestProviderComponent.svelte';
import { Tolgee, DevTools, type TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { mockCoreFetch } from './mockCoreFetch';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

describe('TolgeeProvider integration', () => {
	let tolgee: TolgeeInstance;
	let resolveEnglish: () => void;
	let resolveCzech: () => void;
	beforeEach(async () => {
		const fetchMock = mockCoreFetch();
		resolveCzech = fetchMock.csTranslations.resolve;
		resolveEnglish = fetchMock.enTranslations.resolve;
		fetchMock.fetch.enableMocks();

		tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
			apiKey: API_KEY,
			apiUrl: API_URL,
			defaultLanguage: 'cs',
			fallbackLanguage: 'en'
		});

		render(TestProviderComponent, {
			tolgee
		});
	});

	it('shows correctly loading, fallback and default value', async () => {
		await waitFor(() => {
			expect(screen.queryByText('Loading...')?.innerHTML).toContain('Loading...');
		});
		resolveCzech();
		await waitFor(() => {
			expect(screen.queryByText('Loading...')?.innerHTML).toContain('Loading...');
		});
		resolveEnglish();
		await waitFor(() => {
			expect(screen.queryByTestId('hello_world')?.innerHTML).toContain('Ahoj světe!');
			expect(screen.queryByTestId('english_fallback')?.innerHTML).toContain('English fallback');
			expect(screen.queryByTestId('non_existant')?.innerHTML).toContain('Default value');
		});
	});
});
