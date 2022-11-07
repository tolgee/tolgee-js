import React from 'react';
import '@testing-library/jest-dom';
import mockTranslations from './mockTranslations';
import { ReactPlugin, useTolgee } from '..';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Tolgee, TolgeeEvent, TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';

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

describe('useTranslation hook integration', () => {
  let tolgee: TolgeeInstance;
  let runPromise: Promise<void>;
  const TestComponent = ({ events }: { events?: TolgeeEvent[] }) => {
    const {
      getLanguage,
      getPendingLanguage,
      isFetching,
      isLoading,
      isRunning,
      isInitialLoading,
    } = useTolgee(events);

    return (
      <>
        <div data-testid="language">{String(getLanguage())}</div>
        <div data-testid="pendingLanguage">{String(getPendingLanguage())}</div>
        <div data-testid="fetching">{String(isFetching())}</div>
        <div data-testid="loading">{String(isLoading())}</div>
        <div data-testid="initialLoad">{String(isInitialLoading())}</div>
        <div data-testid="running">{String(isRunning())}</div>
      </>
    );
  };

  beforeEach(async () => {
    tolgee = Tolgee()
      .use(ReactPlugin({ useSuspense: false }))
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

  afterEach(() => {
    tolgee.stop();
  });

  it('updates initialLoading', async () => {
    render(<TestComponent events={['initialLoad']} />);
    checkState({ initialLoad: 'true' });

    await act(async () => {
      resolvePending();
      await runPromise;
    });
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
    await act(async () => {
      tolgee.changeLanguage('en');
      resolvePending();
    });
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
  });

  it('updates language', async () => {
    render(<TestComponent events={['language']} />);
    await act(async () => {
      resolvePending();
      await runPromise;
    });
    checkState({ language: 'cs' });
    await act(async () => {
      tolgee.changeLanguage('en');
      resolvePending();
    });
    checkState({ language: 'en' });
  });

  it('updates pending language', async () => {
    render(<TestComponent events={['pendingLanguage']} />);
    await act(async () => {
      resolvePending();
      await runPromise;
    });
    checkState({ language: 'cs', pendingLanguage: 'cs' });
    await act(async () => {
      tolgee.changeLanguage('en');
      resolvePending();
    });
    await waitFor(async () => {
      checkState({ language: 'cs', pendingLanguage: 'en' });
    });
  });

  it('updates fetching and loading', async () => {
    render(<TestComponent events={['fetching', 'loading']} />);
    checkState({ loading: 'true', fetching: 'true' });

    await act(async () => {
      resolvePending();
      await runPromise;
    });
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
    await act(async () => {
      tolgee.changeLanguage('en');
    });
    await waitFor(() => {
      checkState({ loading: 'false', fetching: 'true' });
    });
    await act(async () => {
      resolvePending();
    });
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
    await act(async () => {
      tolgee.addActiveNs('test');
    });
    await waitFor(() => {
      checkState({ loading: 'true', fetching: 'true' });
    });
    await act(async () => {
      resolvePending();
    });
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
  });
});
