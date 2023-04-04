import {
  ERROR_UNCLOSED_TAG,
  ERROR_UNEXPECTED_TAG,
  ErrorCode,
  TagParserError,
} from './TagParserError';
import { Token } from './tokenizer';

export function handleTag(
  startToken: Token | undefined,
  stack: Token[],
  params: Record<string, any> | undefined,
  fullText: string
) {
  let token: Token | undefined;
  const content: any[] = [];

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

  function simplifyContent() {
    if (content.length === 0) {
      return undefined;
    } else if (content.length === 1 && typeof content[0] === 'string') {
      return content[0];
    } else {
      return content;
    }
  }

  function parsingError(code: ErrorCode): never {
    throw new TagParserError(code, token!.position, fullText);
  }

  while ((token = stack.shift())) {
    if (
      token.type === 'tag' &&
      token.closing &&
      startToken !== undefined &&
      token.data === startToken.data
    ) {
      // matching tag to startToken - closing
      const fun = params?.[startToken.data];
      return fun(simplifyContent());
    } else if (token.type === 'tag' && token.selfClosing) {
      // self-closing - solve in-place
      const fun = params?.[token.data];
      addToContent(fun());
    } else if (token.type === 'tag' && !token.closing) {
      // opening tag - call recursively
      addToContent(handleTag(token, stack, params, fullText));
    } else if (token.type === 'text') {
      // text
      addToContent(token.data);
    } else {
      parsingError(ERROR_UNEXPECTED_TAG);
    }
  }
  if (startToken === undefined) {
    // we are in the root, return content itself
    return simplifyContent();
  }
  parsingError(ERROR_UNCLOSED_TAG);
}
