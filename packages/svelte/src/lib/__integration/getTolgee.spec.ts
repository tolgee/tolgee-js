/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { screen, waitFor, render } from '@testing-library/svelte';

import { Tolgee, type TolgeeEvent, type TolgeeInstance } from '@tolgee/web';
import { SveltePlugin } from '$lib/SveltePlugin';
import { FormatIcu } from '@tolgee/format-icu';
import TestComponent from './components/TestGetTolgee.svelte';
import mockTranslations from './data/mockTranslations';

const API_URL = 'http://localhost';

let pending = [] as (() => void)[];
const resolvePending = () => {
  pending.forEach((resolve) => resolve());
  pending = [];
};

const wrapInPromise = (data: any) => () =>
  new Promise<any>((resolve) => pending.push(() => resolve(data)));

type CheckStateProps = Partial<Record<TolgeeEvent, string>>;

const checkState = (props: CheckStateProps) => {
  Object.entries(props).forEach(([event, value]) => {
    expect(screen.queryByTestId(event)).toContainHTML(value);
  });
};

describe('getTranslate', () => {
  let tolgee: TolgeeInstance;
  let runPromise: Promise<void>;

  beforeEach(async () => {
    tolgee = Tolgee()
      .use(SveltePlugin())
      .use(FormatIcu())
      .init({
        apiUrl: API_URL,
        language: 'cs',
        staticData: {
          cs: wrapInPromise(mockTranslations.cs),
          'cs:test': wrapInPromise(mockTranslations['cs:test']),
          en: wrapInPromise(mockTranslations.en),
          'en:test': wrapInPromise(mockTranslations['en:test']),
        },
      });
    runPromise = tolgee.run();
  });

  it('updates initialLoading', async () => {
    render(TestComponent, {
      props: { events: ['initialLoad'] },
    });

    checkState({ initialLoad: 'true' });
    resolvePending();
    await runPromise;
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
    tolgee.changeLanguage('en');
    resolvePending();
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
  });

  it('updates language', async () => {
    render(TestComponent, {
      props: { events: ['language'] },
    });
    resolvePending();
    await runPromise;
    checkState({ language: 'cs' });
    tolgee.changeLanguage('en');
    resolvePending();
    await waitFor(() => {
      checkState({ language: 'en' });
    });
  });

  it('updates pending language', async () => {
    render(TestComponent, {
      props: { events: ['pendingLanguage'] },
    });
    resolvePending();
    await runPromise;
    checkState({ language: 'cs', pendingLanguage: 'cs' });
    tolgee.changeLanguage('en');
    resolvePending();
    await waitFor(async () => {
      checkState({ language: 'cs', pendingLanguage: 'en' });
    });
  });

  it('updates fetching and loading', async () => {
    render(TestComponent, {
      props: { events: ['loading', 'fetching'] },
    });

    checkState({ loading: 'true', fetching: 'true' });
    resolvePending();
    await runPromise;
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
    tolgee.changeLanguage('en');
    await waitFor(() => {
      checkState({ loading: 'false', fetching: 'true' });
    });
    resolvePending();
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
    tolgee.addActiveNs('test');
    await waitFor(() => {
      checkState({ loading: 'true', fetching: 'true' });
    });
    resolvePending();
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
  });
});
