export enum ErrorEnum {
  EMPTY_PARAMETER,
  UNEXPECTED_CHARACTER,
  UNEXPECTED_END,
}

export class FormatError extends Error {
  public readonly code: ErrorEnum;
  public readonly index: number;
  constructor(code: ErrorEnum, index: number, text: string) {
    super(`Tolgee parser: ${ErrorEnum[code]} at ${index} in ${text}`);
    this.code = code;
    this.index = index;
  }
}
