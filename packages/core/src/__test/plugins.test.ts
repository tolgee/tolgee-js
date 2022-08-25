import { Tolgee } from '../Tolgee';
import {
  FormatPlugin,
  FormatterPluginFormatParams,
  WrapperPlugin,
} from '../types';

const testWrapper: WrapperPlugin = () => {
  const wrap = (key: string, translation: string) => {
    return `${key}|${translation}`;
  };
  const unwrap = (input: string) => {
    const [key, text] = input.split('|');
    return { text, keys: [{ key }] };
  };

  return Object.freeze({ wrap, unwrap });
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
    tolgee.setWrapper(testWrapper);
    expect(tolgee.instant('hello')).toEqual('hello|world');

    tolgee.setFormat(testFormat);
    expect(tolgee.instant('hello')).toEqual('(hello|world)');
  });
});
