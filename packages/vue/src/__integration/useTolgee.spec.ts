import '@testing-library/jest-dom';
import { DevTools, useTolgee, VueTolgee } from '..';
import { render, screen, waitFor } from '@testing-library/vue';
import { Tolgee, TolgeeEvent, TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { PropType } from 'vue';
import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';

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

  const TestComponent = {
    props: { events: Array as PropType<TolgeeEvent[]> },
    setup(props) {
      return useTolgee(props.events).value;
    },
    template: `
      <div>
        <div data-testid="language">{{String(getLanguage())}}</div>
        <div data-testid="pendingLanguage">{{String(getPendingLanguage())}}</div>
        <div data-testid="fetching">{{String(isFetching())}}</div>
        <div data-testid="loading">{{String(isLoading())}}</div>
        <div data-testid="initialLoad">{{String(isInitialLoading())}}</div>
        <div data-testid="running">{{String(isRunning())}}</div>
      </div>`,
  };

  beforeEach(async () => {
    staticDataMock = mockStaticDataAsync();
    tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
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
    render(TestComponent, {
      props: { events: ['initialLoad'] },
      global: { plugins: [[VueTolgee, { tolgee }]] },
    });

    checkState({ initialLoad: 'true' });
    staticDataMock.resolvePending();
    await runPromise;
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
    tolgee.changeLanguage('en');
    staticDataMock.resolvePending();
    await waitFor(() => {
      checkState({ initialLoad: 'false' });
    });
  });

  it('updates language', async () => {
    render(TestComponent, {
      props: { events: ['language'] },
      global: { plugins: [[VueTolgee, { tolgee }]] },
    });
    staticDataMock.resolvePending();
    await runPromise;
    checkState({ language: 'cs' });
    tolgee.changeLanguage('en');
    staticDataMock.resolvePending();
    await waitFor(() => {
      checkState({ language: 'en' });
    });
  });

  it('updates pending language', async () => {
    render(TestComponent, {
      props: { events: ['pendingLanguage'] },
      global: { plugins: [[VueTolgee, { tolgee }]] },
    });
    staticDataMock.resolvePending();
    await runPromise;
    checkState({ language: 'cs', pendingLanguage: 'cs' });
    tolgee.changeLanguage('en');
    staticDataMock.resolvePending();
    await waitFor(async () => {
      checkState({ language: 'cs', pendingLanguage: 'en' });
    });
  });

  it('updates fetching and loading', async () => {
    render(TestComponent, {
      props: { events: ['loading', 'fetching'] },
      global: { plugins: [[VueTolgee, { tolgee }]] },
    });

    checkState({ loading: 'true', fetching: 'true' });
    staticDataMock.resolvePending();
    await runPromise;
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
    tolgee.changeLanguage('en');
    await waitFor(() => {
      checkState({ loading: 'false', fetching: 'true' });
    });
    staticDataMock.resolvePending();
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
    tolgee.addActiveNs('test');
    await waitFor(() => {
      checkState({ loading: 'true', fetching: 'true' });
    });
    staticDataMock.resolvePending();
    await waitFor(async () => {
      checkState({ loading: 'false', fetching: 'false' });
    });
  });
});
