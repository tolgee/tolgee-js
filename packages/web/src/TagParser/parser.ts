import { handleTag } from './handleTag';
import { tokenizer } from './tokenizer';

export function parser(
  text: string,
  params?: Record<string, any>,
  escapeHtml?: boolean
) {
  const tokens = tokenizer(text);

  const result = handleTag(
    undefined,
    [...tokens],
    params,
    text,
    Boolean(escapeHtml)
  );

  return result;
}
