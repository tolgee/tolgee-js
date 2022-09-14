import { Tolgee } from '../Tolgee';
import {
  FinalFormatterInterface,
  FormatterInterface,
  FormatterInterfaceFormatParams,
  ObserverInterface,
  TolgeePlugin,
  WrapperWrapFunction,
} from '../types';

const testObserver: ObserverInterface = () => {
  const wrap: WrapperWrapFunction = ({ key, translation }) => {
    return `${key}|${translation}`;
  };
  const unwrap = (input: string) => {
    const [key, text] = input.split('|');
    return { text, keys: [{ key }] };
  };

  const stop = () => {};

  const retranslate = () => {};

  return Object.freeze({
    wrap,
    unwrap,
    stop,
    retranslate,
    highlightByKey: undefined,
  });
};

const testFormatter1: FormatterInterface = {
  format: ({ translation }: FormatterInterfaceFormatParams) => {
    return `(1${translation})`;
  },
};

const testFormatter2: FormatterInterface = {
  format: ({ translation }: FormatterInterfaceFormatParams) => {
    return `(2${translation})`;
  },
};

const testFinalFormatter: FinalFormatterInterface = {
  format: ({ translation }: FormatterInterfaceFormatParams) => {
    return { final: translation };
  },
};

const observerPlugin: TolgeePlugin = (tolgee, tools) => {
  tools.setObserver(testObserver);
  return tolgee;
};

const formattersPlugin: TolgeePlugin = (tolgee, tools) => {
  tools.addFormatter(testFormatter1);
  tools.addFormatter(testFormatter2);
  tools.setFinalFormatter(testFinalFormatter);
  return tolgee;
};

describe('plugins', () => {
  it('wraps and formats translation', () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    tolgee.use(observerPlugin);
    tolgee.run();
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');

    tolgee.use(formattersPlugin);
    expect(tolgee.t({ key: 'hello' })).toEqual({ final: '(2(1hello|world))' });
    tolgee.stop();
  });
});
