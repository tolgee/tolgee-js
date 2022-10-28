import '@testing-library/jest-dom';
import mockTranslations from './mockTranslations';
import { DevTools, useTolgee, VueTolgee } from '..';
import { render, screen, waitFor } from '@testing-library/vue';
import { Tolgee, TolgeeEvent, TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { PropType } from 'vue';

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
    tolgee = Tolgee()
      .use(DevTools())
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
    render(TestComponent, {
      props: { events: ['initialLoad'] },
      global: { plugins: [[VueTolgee, { tolgee }]] },
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
      global: { plugins: [[VueTolgee, { tolgee }]] },
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
      global: { plugins: [[VueTolgee, { tolgee }]] },
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
      global: { plugins: [[VueTolgee, { tolgee }]] },
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
