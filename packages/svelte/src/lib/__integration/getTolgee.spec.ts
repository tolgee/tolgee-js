/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { screen, waitFor, render } from '@testing-library/svelte';

import {
  Tolgee,
  type TolgeeEvent,
  type TolgeeInstance,
  DevTools,
} from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import TestComponent from './components/TestGetTolgee.svelte';
import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';
import { GlobalContextPlugin } from '$lib/GlobalContextPlugin';

const API_URL = 'http://localhost';

type CheckStateProps = Partial<Record<TolgeeEvent, string>>;

const checkState = (props: CheckStateProps) => {
  Object.entries(props).forEach(([event, value]) => {
    expect(screen.queryByTestId(event)).toContainHTML(value);
  });
};

describe('getTranslate', () => {
  let tolgee: TolgeeInstance;
  let runPromise: Promise<void>;
  let staticDataMock: ReturnType<typeof mockStaticDataAsync>;

  beforeEach(async () => {
    staticDataMock = mockStaticDataAsync();
    tolgee = Tolgee()
      .use(GlobalContextPlugin())
      .use(DevTools())
      .use(FormatIcu())
      .init({
        apiUrl: API_URL,
        language: 'cs',
        staticData: staticDataMock.promises,
      });
    runPromise = tolgee.run();
  });

  it('updates initialLoading', async () => {
    render(TestComponent, {
      props: { events: ['initialLoad'] },
    });

    checkState({ initialLoad: 'true' });
    staticDataMock.resolveAll();
    await runPromise;
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
    tolgee.changeLanguage('en');
    staticDataMock.resolveAll();
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
  });

  it('updates language', async () => {
    render(TestComponent, {
      props: { events: ['language'] },
    });
    staticDataMock.resolveAll();
    await runPromise;
    checkState({ language: 'cs' });
    tolgee.changeLanguage('en');
    staticDataMock.resolveAll();
    await waitFor(() => {
      checkState({ language: 'en' });
    });
  });

  it('updates pending language', async () => {
    render(TestComponent, {
      props: { events: ['pendingLanguage'] },
    });
    staticDataMock.resolveAll();
    await runPromise;
    checkState({ language: 'cs', pendingLanguage: 'cs' });
    tolgee.changeLanguage('en');
    staticDataMock.resolveAll();
    await waitFor(async () => {
      checkState({ language: 'cs', pendingLanguage: 'en' });
    });
  });

  it('updates fetching and loading', async () => {
    render(TestComponent, {
      props: { events: ['loading', 'fetching'] },
    });

    checkState({ loading: 'true', fetching: 'true' });
    staticDataMock.resolveAll();
    await runPromise;
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
    tolgee.changeLanguage('en');
    await waitFor(() => {
      checkState({ loading: 'false', fetching: 'true' });
    });
    staticDataMock.resolveAll();
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
    tolgee.addActiveNs('test');
    await waitFor(() => {
      checkState({ loading: 'true', fetching: 'true' });
    });
    staticDataMock.resolveAll();
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
  });
});
