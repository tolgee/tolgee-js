import { Tolgee } from '../Tolgee';
import {
  FormatPlugin,
  FormatterPluginFormatParams,
  ObserverPlugin,
} from '../types';

const testObserver: ObserverPlugin = () => {
  const wrap = (key: string, translation: string) => {
    return `${key}|${translation}`;
  };
  const unwrap = (input: string) => {
    const [key, text] = input.split('|');
    return { text, keys: [{ key }] };
  };

  const stop = () => {};

  return Object.freeze({ wrap, unwrap, stop });
};

const testFormat: FormatPlugin = () => {
  return Object.freeze({
    format: ({ translation }: FormatterPluginFormatParams) => {
      return `(${translation})`;
    },
  });
};

describe('plugins', () => {
  it('wraps translation', () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    tolgee.setObserver(testObserver);
    tolgee.run();
    expect(tolgee.instant('hello')).toEqual('hello|world');

    tolgee.setFormat(testFormat);
    expect(tolgee.instant('hello')).toEqual('(hello|world)');
    tolgee.stop();
  });
});
