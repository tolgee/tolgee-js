import { TolgeeCore } from '../TolgeeCore';
import {
  FinalFormatterMiddleware,
  FormatterMiddleware,
  FormatterMiddlewareFormatParams,
  ObserverMiddleware,
  TolgeePlugin,
  WrapperWrapFunction,
} from '../types';

const testObserver =
  (outputNotFormattable: boolean): ObserverMiddleware =>
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
      findPositions: () => [],
      outputNotFormattable,
    });
  };

const testFormatter1: FormatterMiddleware = {
  format: ({ translation }: FormatterMiddlewareFormatParams) => {
    return `(1${translation})`;
  },
};

const testFormatter2: FormatterMiddleware = {
  format: ({ translation }: FormatterMiddlewareFormatParams) => {
    return `(2${translation})`;
  },
};

const testFinalFormatter: FinalFormatterMiddleware = {
  format: ({ translation }: FormatterMiddlewareFormatParams) => {
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
    const tolgee = TolgeeCore().init({
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
    const tolgee = TolgeeCore().init({
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
});
