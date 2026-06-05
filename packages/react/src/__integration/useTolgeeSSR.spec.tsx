import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Tolgee, TolgeeInstance, encodeCacheKey } from '@tolgee/web';
import { useTolgeeSSR } from '..';

const enCommon = { hello: 'Hello' };

describe('useTolgeeSSR missing-records warning', () => {
  let tolgee: TolgeeInstance;
  let warnSpy: jest.SpyInstance;

  const SsrComponent = ({
    data,
  }: {
    data: Record<string, Record<string, string>>;
  }) => {
    useTolgeeSSR(tolgee, 'en', data);
    return null;
  };

  beforeEach(() => {
    // not run() -> a required record stays uncached so isLoaded() is false and
    // the SSR warning path runs
    tolgee = Tolgee().init({ language: 'en', ns: ['common', 'extra'] });
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
    tolgee.stop();
  });

  it('warns only about genuinely missing records, using the canonical language:namespace key', () => {
    act(() => {
      render(
        <SsrComponent
          data={{
            [encodeCacheKey({ language: 'en', namespace: 'common' })]: enCommon,
          }}
        />
      );
    });

    expect(warnSpy).toHaveBeenCalledWith(
      `Tolgee: Missing records in "staticData" for proper SSR functionality: "${encodeCacheKey(
        { language: 'en', namespace: 'extra' }
      )}"`
    );
  });
});
