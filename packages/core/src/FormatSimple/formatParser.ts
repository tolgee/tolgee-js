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

const STATE_TEXT = 0,
  STATE_ESCAPE_MAYBE = 1,
  STATE_ESCAPE = 2,
  STATE_PARAM = 3,
  STATE_PARAM_AFTER = 4;

type State =
  | typeof STATE_TEXT
  | typeof STATE_ESCAPE_MAYBE
  | typeof STATE_ESCAPE
  | typeof STATE_PARAM
  | typeof STATE_PARAM_AFTER;

const END_STATES = new Set<State>([
  STATE_ESCAPE,
  STATE_ESCAPE_MAYBE,
  STATE_TEXT,
]);
const CHAR_ESCAPE = "'";
const ESCAPABLE = new Set(['{', '}', CHAR_ESCAPE]);

const isAllowedInParam = (char: string) => {
  return /[0-9a-zA-Z_]/.test(char);
};

export function formatParser(translation: string) {
  let state: State = STATE_TEXT;
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
      case STATE_TEXT:
        if (ch === CHAR_ESCAPE) {
          text += ch;
          state = STATE_ESCAPE_MAYBE;
        } else if (ch === '{') {
          addText();
          state = STATE_PARAM;
        } else {
          text += ch;
          state = STATE_TEXT;
        }
        break;

      case STATE_ESCAPE_MAYBE:
        if (ESCAPABLE.has(ch)) {
          text = text.slice(0, -1) + ch;
          state = STATE_ESCAPE;
        } else {
          text += ch;
          state = STATE_TEXT;
        }
        break;
      case STATE_ESCAPE:
        if (ch === CHAR_ESCAPE) {
          state = STATE_TEXT;
        } else {
          text += ch;
          state = STATE_ESCAPE;
        }
        break;
      case STATE_PARAM:
        if (ch === '}') {
          addParam();
          state = STATE_TEXT;
        } else if (!isWhitespace(ch)) {
          addParamChar();
          state = STATE_PARAM;
        } else if (param !== '') {
          addParam();
          state = STATE_PARAM_AFTER;
        }

        break;
      case STATE_PARAM_AFTER:
        if (ch == '}') {
          state = STATE_TEXT;
        } else if (isWhitespace(ch)) {
          state = STATE_PARAM_AFTER;
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
