import { ErrorEnum, FormatError } from './FormatError';

function isWhitespace(ch: string) {
  return /\s/.test(ch);
}

enum State {
  TEXT,
  ESCAPE_MAYBE,
  ESCAPE,
  PARAM,
  PARAM_AFTER,
}

const END_STATES = new Set([State.ESCAPE, State.ESCAPE_MAYBE, State.TEXT]);
const CHAR_ESCAPE = "'";
const ESCAPABLE = new Set(['{', '}', CHAR_ESCAPE]);

const isAllowedInParam = (char: string) => {
  return /[0-9a-zA-Z_]/.test(char);
};

export function formatParser(translation: string) {
  let state: State = State.TEXT;
  let text = '';
  let param = '';
  let ch = '';
  const texts: string[] = [];
  const params: string[] = [];

  let i = 0;

  function parsingError(code: ErrorEnum): never {
    throw new FormatError(code, i, translation);
  }

  const addText = () => {
    texts.push(text);
    text = '';
  };

  const addParamChar = () => {
    if (!isAllowedInParam(ch)) {
      parsingError(ErrorEnum.UNEXPECTED_CHARACTER);
    }
    param += ch;
  };

  const addParam = () => {
    if (param === '') {
      parsingError(ErrorEnum.EMPTY_PARAMETER);
    }
    params.push(param);
    param = '';
  };

  for (i = 0; i < translation.length; i++) {
    ch = translation[i];
    switch (state) {
      case State.TEXT:
        if (ch === CHAR_ESCAPE) {
          text += ch;
          state = State.ESCAPE_MAYBE;
        } else if (ch === '{') {
          addText();
          state = State.PARAM;
        } else {
          text += ch;
          state = State.TEXT;
        }
        break;

      case State.ESCAPE_MAYBE:
        if (ESCAPABLE.has(ch)) {
          text = text.slice(0, -1) + ch;
          state = State.ESCAPE;
        } else {
          text += ch;
          state = State.TEXT;
        }
        break;
      case State.ESCAPE:
        if (ch === CHAR_ESCAPE) {
          state = State.TEXT;
        } else {
          text += ch;
          state = State.ESCAPE;
        }
        break;
      case State.PARAM:
        if (ch === '}') {
          addParam();
          state = State.TEXT;
        } else if (isWhitespace(ch)) {
          addParamChar();
          state = State.PARAM;
        } else if (param !== '') {
          addParam();
          state = State.PARAM_AFTER;
        }

        break;
      case State.PARAM_AFTER:
        if (ch == '}') {
          state = State.TEXT;
        } else if (isWhitespace(ch)) {
          state = State.PARAM_AFTER;
        } else {
          parsingError(ErrorEnum.UNEXPECTED_CHARACTER);
        }
    }
  }
  if (!END_STATES.has(state)) {
    parsingError(ErrorEnum.UNEXPECTED_END);
  }
  addText();
  return [texts, params];
}
