jest.autoMockOff();

import '@testing-library/jest-dom';
import { render } from '@testing-library/vue';

import {
  TolgeeProvider,
  VueTolgee,
  Tolgee,
  TolgeeInstance,
  encodeCacheKey,
} from '..';

const enCommon = { hello: 'Hello' };
const enExtra = { bye: 'Bye' };
const commonKey = encodeCacheKey({ language: 'en', namespace: 'common' });
const extraKey = encodeCacheKey({ language: 'en', namespace: 'extra' });

const SsrWrapper = {
  components: { TolgeeProvider },
  template: `<TolgeeProvider :ssr="ssr"><div /></TolgeeProvider>`,
  props: ['ssr'],
};

function renderWithSsr(tolgee: TolgeeInstance, ssr: Record<string, unknown>) {
  return render(SsrWrapper, {
    props: { ssr },
    global: { plugins: [[VueTolgee, { tolgee, enableSSR: true }]] },
  });
}

describe('TolgeeProvider SSR missing-records warning', () => {
  let tolgee: TolgeeInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    // not run() -> isLoaded() stays false so the SSR warning path is exercised
    tolgee = Tolgee().init({ language: 'en', ns: ['common', 'extra'] });
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
    tolgee.stop();
  });

  it('warns only about genuinely missing records, using the canonical language:namespace key', () => {
    renderWithSsr(tolgee, {
      language: 'en',
      staticData: { [commonKey]: enCommon },
    });

    expect(warnSpy).toHaveBeenCalledWith(
      `Tolgee: Missing records in "staticData" for proper SSR functionality: "${extraKey}"`
    );
  });

  it('does not emit an empty warning when lazy static data covers every required record', () => {
    // Function-valued static data is not written to the cache, so isLoaded()
    // stays false and the warning path runs — but every required key is present,
    // so missingRecords is empty and nothing should be logged.
    renderWithSsr(tolgee, {
      language: 'en',
      staticData: {
        [commonKey]: () => Promise.resolve(enCommon),
        [extraKey]: () => Promise.resolve(enExtra),
      },
    });

    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Missing records')
    );
  });
});
