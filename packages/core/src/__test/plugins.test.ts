import { Tolgee } from '../Tolgee';
import {
  FinalFormatterInterface,
  FormatterInterface,
  FormatterInterfaceFormatParams,
  ObserverInterface,
  WrapperWrapFunction,
  ObserverOptions,
} from '../types';
import { TolgeePlugin } from '../types/plugin';

const testObserver =
  (
    outputNotFormattable: boolean,
    onCreate?: (options: ObserverOptions) => void
  ): ObserverInterface =>
  ({ options }) => {
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

    onCreate?.(options);

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
  (
    outputNotFormattable: boolean,
    onCreate?: (options: ObserverOptions) => void
  ): TolgeePlugin =>
  (tolgee, tools) => {
    tools.setObserver(testObserver(outputNotFormattable, onCreate));
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
    tolgee.use(observerPlugin(false));
    tolgee.run();
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');

    tolgee.use(formattersPlugin);
    expect(tolgee.t({ key: 'hello' })).toEqual({ final: '(2(1hello|world))' });
    tolgee.stop();
  });

  it("won't format when observer doesn't return formattable text", () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    tolgee.use(observerPlugin(true));
    tolgee.run();
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');

    tolgee.use(formattersPlugin);
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');
    tolgee.stop();
  });

  it("won't wrap before run", () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    tolgee.use(observerPlugin(false));
    expect(tolgee.t({ key: 'hello' })).toEqual('world');
    tolgee.run();
    expect(tolgee.t({ key: 'hello' })).toEqual('hello|world');
  });

  it('observer recieves options', () => {
    const tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    });
    const restrictedElements = ['test'];
    tolgee.setObserverOptions({
      restrictedElements,
    });
    const onCreate = jest.fn();
    tolgee.use(observerPlugin(false, onCreate));
    tolgee.run();
    expect(onCreate).toBeCalledTimes(1);
    expect(onCreate.mock.calls[0][0].restrictedElements).toEqual(
      restrictedElements
    );
  });
});
