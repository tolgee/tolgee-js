import React, { act } from 'react';
import '@testing-library/jest-dom';
import { DevTools, useTolgee, GlobalContextPlugin } from '..';
import { render, screen, waitFor } from '@testing-library/react';
import { Tolgee, TolgeeEvent, TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';
import { wait } from '@tolgee/testing/wait';

const API_URL = 'http://localhost';

type CheckStateProps = Partial<Record<TolgeeEvent, string>>;

const checkState = (props: CheckStateProps) => {
  Object.entries(props).forEach(([event, value]) => {
    expect(screen.queryByTestId(event)).toContainHTML(value);
  });
};

describe('useTranslation hook integration', () => {
  let tolgee: TolgeeInstance;
  let runPromise: Promise<void>;
  let staticDataMock: ReturnType<typeof mockStaticDataAsync>;
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
    staticDataMock = mockStaticDataAsync();

    tolgee = Tolgee()
      .use(DevTools())
      .use(GlobalContextPlugin())
      .use(FormatIcu())
      .init({
        apiUrl: API_URL,
        language: 'cs',
        staticData: staticDataMock.promises,
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
      await wait(0);
      staticDataMock.resolvablePromises.cs.resolve();
      await runPromise;
    });
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
    await act(async () => {
      tolgee.changeLanguage('en');
      await wait(0);
      staticDataMock.resolvablePromises.en.resolve();
    });
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
  });

  it('updates language', async () => {
    render(<TestComponent events={['language']} />);
    await act(async () => {
      staticDataMock.resolvablePromises.cs.resolve();
      await runPromise;
    });
    checkState({ language: 'cs' });
    await act(async () => {
      tolgee.changeLanguage('en');
      await wait(0);
      staticDataMock.resolvablePromises.en.resolve();
    });
    checkState({ language: 'en' });
  });

  it('updates pending language', async () => {
    render(<TestComponent events={['pendingLanguage']} />);
    await act(async () => {
      staticDataMock.resolvablePromises.cs.resolve();
      await runPromise;
    });
    checkState({ language: 'cs', pendingLanguage: 'cs' });
    await act(async () => {
      tolgee.changeLanguage('en');
      await wait(0);
      staticDataMock.resolvablePromises.en.resolve();
    });
    await waitFor(async () => {
      checkState({ language: 'cs', pendingLanguage: 'en' });
    });
  });

  it('updates fetching and loading', async () => {
    render(<TestComponent events={['fetching', 'loading']} />);
    checkState({ loading: 'true', fetching: 'true' });

    await act(async () => {
      staticDataMock.resolvablePromises.cs.resolve();
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
      staticDataMock.resolvablePromises.en.resolve();
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
      staticDataMock.resolvablePromises['en:test'].resolve();
    });
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
  });
});
