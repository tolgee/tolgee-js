import type {
  KeyAndParams,
  TranslatePropsInternal,
  WrapperMiddleware,
} from '@tolgee/core';
import { isCharEscaped } from './helpers';

type Props = {
  inputPrefix: string;
  inputSuffix: string;
  translate: (params: TranslatePropsInternal) => string;
};

export function TextWrapper({
  inputPrefix,
  inputSuffix,
  translate,
}: Props): WrapperMiddleware {
  function getRawUnWrapRegex(): string {
    const escapedPrefix = escapeForRegExp(inputPrefix);
    const escapedSuffix = escapeForRegExp(inputSuffix);
    return `(\\\\?)(${escapedPrefix}(.*?)${escapedSuffix})`;
  }

  function parseUnwrapped(unwrappedString: string): KeyAndParams {
    let escaped = false;
    let actual = '';
    let paramName = '';
    let readingState:
      | 'KEY'
      | 'DEFAULT_VALUE'
      | 'PARAM_NAME'
      | 'PARAM_VALUE'
      | 'NAMESPACE' = 'KEY';

    const result = {
      key: '',
      ns: undefined as string | undefined,
      params: {},
      defaultValue: undefined as string | undefined,
    } as KeyAndParams;

    const addNamespace = (ns: string) => {
      result.ns = ns;
    };

    for (const char of unwrappedString) {
      if (char === '\\' && !escaped) {
        escaped = true;
        continue;
      }
      if (escaped) {
        escaped = false;
        actual += char;
        continue;
      }
      if (readingState === 'KEY' && char === ',') {
        readingState = 'DEFAULT_VALUE';
        result.key = actual;
        actual = '';
        continue;
      }
      if (readingState === 'KEY' && char === '|') {
        readingState = 'NAMESPACE';
        result.key = actual;
        actual = '';
        continue;
      }
      if (readingState === 'NAMESPACE' && char === ',') {
        readingState = 'DEFAULT_VALUE';
        addNamespace(actual);
        actual = '';
        continue;
      }
      if (readingState === 'KEY' && char === ':') {
        readingState = 'PARAM_NAME';
        result.key = actual;
        actual = '';
        continue;
      }

      if (readingState === 'DEFAULT_VALUE' && char === ':') {
        readingState = 'PARAM_NAME';
        result.defaultValue = actual;
        actual = '';
        continue;
      }

      if (readingState === 'PARAM_NAME' && char === ':') {
        readingState = 'PARAM_VALUE';
        paramName = actual;
        actual = '';
        continue;
      }

      if (readingState === 'PARAM_VALUE' && char === ',') {
        readingState = 'PARAM_NAME';
        result.params![paramName] = actual;
        actual = '';
        continue;
      }
      actual += char;
    }

    if (readingState === 'KEY') {
      result.key = actual;
    }

    if (readingState === 'DEFAULT_VALUE') {
      result.defaultValue = actual;
    }

    if (readingState === 'PARAM_VALUE') {
      result.params![paramName] = actual;
    }

    if (readingState === 'NAMESPACE') {
      addNamespace(actual);
    }

    return result;
  }

  function getTranslatedWithMetadata(text: string) {
    const { key, params, defaultValue, ns } = parseUnwrapped(text);
    const translated = translate({
      key,
      params,
      defaultValue,
      ns,
      noWrap: true,
    });
    return { translated, key, params, defaultValue, ns };
  }

  function escapeForRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeParam(param: any) {
    if (typeof param === 'string') {
      return param.replace(/[,:|\\]/gs, '\\$&');
    }
    if (typeof param === 'number' || typeof param === 'bigint') {
      return param.toString();
    }
    // eslint-disable-next-line no-console
    console.warn(
      `Parameters of type "${typeof param}" are not supported in "text" wrapper mode.`
    );
    return param;
  }

  return Object.freeze({
    wrap({ key, params, defaultValue, ns }): string {
      let paramString = Object.entries(params || {})
        .map(
          ([name, value]) =>
            `${escapeParam(name)}:${escapeParam(value as string)}`
        )
        .join(',');
      paramString = paramString.length ? `:${paramString}` : '';

      const defaultString =
        defaultValue !== undefined ? `,${escapeParam(defaultValue)}` : '';

      const nsArray = typeof ns === 'string' ? [ns] : ns;

      const namespaces = nsArray?.length
        ? `|${nsArray.map((ns) => escapeParam(ns)).join('|')}`
        : '';

      return `${inputPrefix}${escapeParam(
        key
      )}${namespaces}${defaultString}${paramString}${inputSuffix}`;
    },

    unwrap(text: string) {
      const matchRegexp = new RegExp(getRawUnWrapRegex(), 'gs');

      const keysAndParams: KeyAndParams[] = [];

      let matched = false;

      let match;
      let start = 0;
      let result = '';
      while ((match = matchRegexp.exec(text)) !== null) {
        let pre = match[1] as string;
        const [fullMatch, _, wrapped, unwrapped] = match as unknown as [
          string,
          string,
          string,
          string,
        ];
        const { index, input } = match;
        result += input.substr(start, index - start);
        start = index + fullMatch.length;
        if (pre === '\\') {
          if (!isCharEscaped(index, text)) {
            result += wrapped;
            continue;
          }
          pre = '';
        }
        const translated = getTranslatedWithMetadata(unwrapped);
        keysAndParams.push({
          key: translated.key,
          params: translated.params,
          defaultValue: translated.defaultValue,
          ns: translated.ns,
        });
        matched = true;
        result += pre + translated.translated;
      }

      result += text.substring(start);

      if (matched) {
        return { text: result, keys: keysAndParams };
      }

      return { text: text, keys: [] };
    },

    testTextNode(textNode: Text) {
      return (
        (textNode.textContent?.includes(inputPrefix) &&
          textNode.textContent?.includes(inputSuffix)) ??
        false
      );
    },

    testAttribute(attribute: Attr) {
      return (
        attribute.value.includes(inputPrefix) &&
        attribute.value.includes(inputSuffix)
      );
    },
  });
}
