import {
  ErrorCode,
  ERROR_PARAM_EMPTY,
  ERROR_UNEXPECTED_CHAR,
  ERROR_UNEXPECTED_END,
  FormatError,
} from './FormatError';

function isWhitespace(ch: string) {
  return /\s/.test(ch);
}

const TEXT = 0,
  ESCAPE_MAYBE = 1,
  ESCAPE = 2,
  PARAM = 3,
  PARAM_AFTER = 4;

type State =
  | typeof TEXT
  | typeof ESCAPE_MAYBE
  | typeof ESCAPE
  | typeof PARAM
  | typeof PARAM_AFTER;

const END_STATES = new Set<State>([ESCAPE, ESCAPE_MAYBE, TEXT]);
const CHAR_ESCAPE = "'";
const ESCAPABLE = new Set(['{', '}', CHAR_ESCAPE]);

const isAllowedInParam = (char: string) => {
  return /[0-9a-zA-Z_]/.test(char);
};

export function formatParser(translation: string) {
  let state: State = TEXT;
  let text = '';
  let param = '';
  let ch = '';
  const texts: string[] = [];
  const params: string[] = [];

  let i = 0;

  function parsingError(code: ErrorCode): never {
    throw new FormatError(code, i, translation);
  }

  const addText = () => {
    texts.push(text);
    text = '';
  };

  const addParamChar = () => {
    if (!isAllowedInParam(ch)) {
      parsingError(ERROR_UNEXPECTED_CHAR);
    }
    param += ch;
  };

  const addParam = () => {
    if (param === '') {
      parsingError(ERROR_PARAM_EMPTY);
    }
    params.push(param);
    param = '';
  };

  for (i = 0; i < translation.length; i++) {
    ch = translation[i];
    switch (state) {
      case TEXT:
        if (ch === CHAR_ESCAPE) {
          text += ch;
          state = ESCAPE_MAYBE;
        } else if (ch === '{') {
          addText();
          state = PARAM;
        } else {
          text += ch;
          state = TEXT;
        }
        break;

      case ESCAPE_MAYBE:
        if (ESCAPABLE.has(ch)) {
          text = text.slice(0, -1) + ch;
          state = ESCAPE;
        } else {
          text += ch;
          state = TEXT;
        }
        break;
      case ESCAPE:
        if (ch === CHAR_ESCAPE) {
          state = TEXT;
        } else {
          text += ch;
          state = ESCAPE;
        }
        break;
      case PARAM:
        if (ch === '}') {
          addParam();
          state = TEXT;
        } else if (!isWhitespace(ch)) {
          addParamChar();
          state = PARAM;
        } else if (param !== '') {
          addParam();
          state = PARAM_AFTER;
        }

        break;
      case PARAM_AFTER:
        if (ch == '}') {
          state = TEXT;
        } else if (isWhitespace(ch)) {
          state = PARAM_AFTER;
        } else {
          parsingError(ERROR_UNEXPECTED_CHAR);
        }
    }
  }
  if (!END_STATES.has(state)) {
    parsingError(ERROR_UNEXPECTED_END);
  }
  addText();
  return [texts, params];
}
