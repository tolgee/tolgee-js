/* eslint-disable no-console */
import { FormatSimple } from '../FormatSimple/FormatSimple';
import { TolgeeCore } from '../TolgeeCore';

describe('format error', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  it('returns default error', () => {
    const tolgee = TolgeeCore().use(FormatSimple()).init({ language: 'en' });

    expect(tolgee.t('test', 'missing {param}')).toEqual('invalid');
    expect(console.error).toBeCalledTimes(1);
  });

  it('returns specified error message', () => {
    const tolgee = TolgeeCore()
      .use(FormatSimple())
      .init({ language: 'en', onFormatError: 'my error' });

    expect(tolgee.t('test', 'missing {param}')).toEqual('my error');
    expect(console.error).toBeCalledTimes(1);
  });

  it('accepts error handler function', () => {
    const tolgee = TolgeeCore()
      .use(FormatSimple())
      .init({
        language: 'en',
        onFormatError(error) {
          return error;
        },
      });

    expect(tolgee.t('test', 'missing {param}')).toEqual(
      'Missing parameter "param" in "missing {param}"'
    );
    expect(console.error).toBeCalledTimes(1);
  });

  it('handler recieves correct information', () => {
    const tolgee = TolgeeCore()
      .use(FormatSimple())
      .init({
        language: 'en',
        onFormatError(_, { key, defaultValue, params }) {
          return JSON.stringify({ key, defaultValue, params });
        },
      });

    expect(tolgee.t('test', 'missing {param}', { param2: 'test' })).toEqual(
      JSON.stringify({
        key: 'test',
        defaultValue: 'missing {param}',
        params: { param2: 'test' },
      })
    );
    expect(console.error).toBeCalledTimes(1);
  });
});
