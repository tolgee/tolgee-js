export const ERROR_UNEXPECTED_CHAR = 0,
  ERROR_UNEXPECTED_END = 1,
  ERROR_UNEXPECTED_TAG = 2,
  ERROR_UNCLOSED_TAG = 3;

export type ErrorCode =
  | typeof ERROR_UNEXPECTED_CHAR
  | typeof ERROR_UNEXPECTED_END
  | typeof ERROR_UNEXPECTED_TAG
  | typeof ERROR_UNCLOSED_TAG;

export class TagParserError extends Error {
  public readonly code: ErrorCode;
  public readonly index: number;
  constructor(code: ErrorCode, index: number, text: string) {
    let error: string;
    if (code === ERROR_UNEXPECTED_CHAR) {
      error = 'Unexpected character';
    } else if (code === ERROR_UNEXPECTED_END) {
      error = 'Unexpected end';
    } else if (code === ERROR_UNEXPECTED_TAG) {
      error = 'Unexpected tag';
    } else {
      error = 'Unclosed tag';
    }
    super(`Tag parser error: ${error} at ${index} in "${text}"`);
    this.code = code;
    this.index = index;
  }
}
