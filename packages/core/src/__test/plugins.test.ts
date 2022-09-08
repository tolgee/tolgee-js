import { Tolgee } from '../Tolgee';
import {
  FinalFormatterPlugin,
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

const testFormatter1: FormatterPlugin = {
  format: ({ translation }: FormatterPluginFormatParams) => {
    return `(1${translation})`;
  },
};

const testFormatter2: FormatterPlugin = {
  format: ({ translation }: FormatterPluginFormatParams) => {
    return `(2${translation})`;
  },
};

const testFinalFormatter: FinalFormatterPlugin = {
  format: ({ translation }: FormatterPluginFormatParams) => {
    return { final: translation };
  },
};

describe('plugins', () => {
  it('wraps and formats translation', () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    tolgee.setObserver(testObserver);
    tolgee.run();
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');

    tolgee.addFormatter(testFormatter1);
    tolgee.addFormatter(testFormatter2);
    tolgee.setFinalFormatter(testFinalFormatter);
    expect(tolgee.t({ key: 'hello' })).toEqual({ final: '(2(1hello|world))' });
    tolgee.stop();
  });
});
