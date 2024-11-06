export const ERROR_PARAM_EMPTY = 0,
  ERROR_UNEXPECTED_CHAR = 1,
  ERROR_UNEXPECTED_END = 2;

export type ErrorCode =
  | typeof ERROR_PARAM_EMPTY
  | typeof ERROR_UNEXPECTED_CHAR
  | typeof ERROR_UNEXPECTED_END;

export class FormatError extends Error {
  public readonly code: ErrorCode;
  public readonly index: number;
  constructor(code: ErrorCode, index: number, text: string) {
    let error: string;
    let hint = '';
    if (code === ERROR_PARAM_EMPTY) {
      error = 'Empty parameter';
    } else if (code === ERROR_UNEXPECTED_CHAR) {
      error = 'Unexpected character';
      hint = 'Did you forget to use FormatIcu to render ICU message syntax?';
    } else {
      error = 'Unexpected end';
    }
    super(
      `Tolgee parser: ${error} at ${index} in "${text}"` +
        (hint ? '\n' + hint : '')
    );
    this.code = code;
    this.index = index;
  }
}
