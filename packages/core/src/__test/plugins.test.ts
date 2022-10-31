import { Tolgee } from '../Tolgee';
import {
  FinalFormatterInterface,
  FormatterInterface,
  FormatterInterfaceFormatParams,
  ObserverInterface,
  WrapperWrapFunction,
} from '../types';
import { TolgeePlugin } from '../types/plugin';

const testObserver =
  (outputNotFormattable: boolean): ObserverInterface =>
  () => {
    const wrap: WrapperWrapFunction = ({ key, translation }) => {
      return `${key}|${translation}`;
    };
    const unwrap = (input: string) => {
      const [key, text] = input.split('|');
      return { text, keys: [{ key }] };
    };

    const stop = () => {};
    const run = () => {};

    const retranslate = () => {};

    return Object.freeze({
      wrap,
      unwrap,
      run,
      stop,
      retranslate,
      highlight: () => ({ unhighlight: () => {} }),
      outputNotFormattable,
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

const observerPlugin =
  (outputNotFormattable: boolean): TolgeePlugin =>
  (tolgee, tools) => {
    tools.setObserver(testObserver(outputNotFormattable));
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
    const tolgee = Tolgee().init({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    tolgee.addPlugin(observerPlugin(false));
    tolgee.run();
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');

    tolgee.addPlugin(formattersPlugin);
    expect(tolgee.t({ key: 'hello' })).toEqual({ final: '(2(1hello|world))' });
    tolgee.stop();
  });

  it("won't format when observer doesn't return formattable text", () => {
    const tolgee = Tolgee().init({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    tolgee.addPlugin(observerPlugin(true));
    tolgee.run();
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');

    tolgee.addPlugin(formattersPlugin);
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');
    tolgee.stop();
  });

  it("won't wrap before run", () => {
    const tolgee = Tolgee().init({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    tolgee.addPlugin(observerPlugin(false));
    expect(tolgee.t({ key: 'hello' })).toEqual('world');
    tolgee.run();
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');
  });
});
