import { htmlEscape } from './htmlEscape';
import { Token } from './tokenizer';

export function handleTag(
  startToken: Token | undefined,
  stack: Token[],
  params: Record<string, any> | undefined,
  fullText: string,
  escapeHtml: boolean
) {
  let token: Token | undefined;
  let content: any[] = [];

  function escape(text: any) {
    if (typeof text === 'string' && escapeHtml) {
      return htmlEscape(text);
    } else {
      return text;
    }
  }

  function addToContent(item: any) {
    if (
      typeof content[content.length - 1] === 'string' &&
      typeof item === 'string'
    ) {
      content[content.length - 1] += item;
    } else {
      content.push(item);
    }
  }

  function prependContent(item: any) {
    if (typeof content[0] === 'string' && typeof item === 'string') {
      content[0] = item + content[0];
    } else {
      content = [item, ...content];
    }
  }

  function simplifyContent() {
    if (content.length === 0) {
      return undefined;
    } else if (content.length === 1 && typeof content[0] === 'string') {
      return content[0];
    } else {
      return content;
    }
  }

  function getParamFunc(name: string) {
    const func = params?.[name];
    if (typeof func === 'function') {
      return func;
    }
    return undefined;
  }

  while ((token = stack.shift())) {
    if (
      token.type === 'tag' &&
      token.closing &&
      startToken !== undefined &&
      token.name === startToken.name
    ) {
      // matching tag to startToken - closing
      const fun = getParamFunc(startToken.name);
      return fun(simplifyContent());
    } else if (
      token.type === 'tag' &&
      token.selfClosing &&
      getParamFunc(token.name)
    ) {
      // self-closing - solve in-place
      const fun = getParamFunc(token.name);
      addToContent(fun());
    } else if (
      token.type === 'tag' &&
      !token.closing &&
      getParamFunc(token.name)
    ) {
      // opening tag - call recursively
      addToContent(handleTag(token, stack, params, fullText, escapeHtml));
    } else {
      // treat everything else as text
      addToContent(escape(token.text));
    }
  }
  if (startToken !== undefined) {
    prependContent(escape(startToken.text));
  }
  return simplifyContent();
}
