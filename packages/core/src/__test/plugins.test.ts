import { Tolgee } from '../Tolgee';
import {
  FormatterPlugin,
  FormatterPluginFormatParams,
  ObserverPlugin,
  WrapperWrapFunction,
} from '../types';

const testObserver: ObserverPlugin = () => {
  const wrap: WrapperWrapFunction = ({ key, translation }) => {
    return `${key}|${translation}`;
  };
  const unwrap = (input: string) => {
    const [key, text] = input.split('|');
    return { text, keys: [{ key }] };
  };

  const stop = () => {};

  const retranslate = () => {};

  return Object.freeze({ wrap, unwrap, stop, retranslate });
};

const testFormatter: FormatterPlugin = {
  format: ({ translation }: FormatterPluginFormatParams) => {
    return `(${translation})`;
  },
};

describe('plugins', () => {
  it('wraps translation', () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    tolgee.setObserver(testObserver);
    tolgee.run();
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');

    tolgee.setFormatter(testFormatter);
    expect(tolgee.t({ key: 'hello' })).toEqual('(hello|world)');
    tolgee.stop();
  });
});
