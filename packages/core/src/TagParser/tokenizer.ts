import {
  ERROR_UNEXPECTED_CHAR,
  ERROR_UNEXPECTED_END,
  ErrorCode,
  TagParserError,
} from './TagParserError';

const STATE_TEXT = 0,
  STATE_ESCAPE_MAYBE = 1,
  STATE_ESCAPE = 2,
  STATE_TAG_START = 3,
  STATE_TAG_NAME = 4,
  STATE_SELF_CLOSING = 5;

type State =
  | typeof STATE_TEXT
  | typeof STATE_ESCAPE_MAYBE
  | typeof STATE_ESCAPE
  | typeof STATE_TAG_START
  | typeof STATE_TAG_NAME
  | typeof STATE_SELF_CLOSING;

const CHAR_ESCAPE = "'";
const ESCAPABLE = new Set(['<', CHAR_ESCAPE]);

const END_STATES = new Set([STATE_TEXT, STATE_ESCAPE_MAYBE, STATE_ESCAPE]);

export type Token = {
  type: 'text' | 'tag';
  data: string;
  closing: boolean;
  selfClosing: boolean;
  position: number;
};

function isWhite(char: string) {
  return /\s/g.test(char);
}

function isNameChar(char: string) {
  return /[A-Za-z0-9]/.test(char);
}

export function tokenizer(text: string) {
  const tokens: Token[] = [];
  let state: State = STATE_TEXT;
  let data = '';
  let closing = false;
  let selfClosing = false;
  let tokenPosition = 0;

  let i = 0;

  function parsingError(code: ErrorCode): never {
    throw new TagParserError(code, i, text);
  }

  function createToken(type: Token['type']) {
    if (data.length) {
      tokens.push({
        type,
        data,
        closing,
        selfClosing,
        position: tokenPosition,
      });
      closing = false;
      selfClosing = false;
      data = '';
      tokenPosition = i;
    }
  }

  for (i = 0; i < text.length; i++) {
    const char = text[i];
    switch (state) {
      case STATE_TEXT:
        if (char === '<') {
          createToken('text');
          state = STATE_TAG_START;
        } else if (char === CHAR_ESCAPE) {
          state = STATE_ESCAPE_MAYBE;
        } else {
          data += char;
        }
        break;

      case STATE_ESCAPE_MAYBE:
        if (ESCAPABLE.has(char)) {
          data = data.slice(0, -1) + char;
          state = STATE_ESCAPE;
        } else {
          data += data;
          state = STATE_TEXT;
        }
        break;

      case STATE_ESCAPE:
        if (char === CHAR_ESCAPE) {
          state = STATE_TEXT;
        } else {
          data += char;
        }
        break;

      case STATE_TAG_START:
        if (char === '/' && !closing) {
          closing = true;
        } else if (isNameChar(char)) {
          data += char;
          state = STATE_TAG_NAME;
        } else {
          // invalid tag
          parsingError(ERROR_UNEXPECTED_CHAR);
        }
        break;

      case STATE_TAG_NAME:
        if (char === '>') {
          createToken('tag');
          state = STATE_TEXT;
        } else if (isNameChar(char)) {
          data += char.toLowerCase();
        } else if (char === '/' && data !== '') {
          // self-closing slash
          selfClosing = true;
          state = STATE_SELF_CLOSING;
        } else if (isWhite(char) && data !== '') {
          // skiping white spaces after tag name
          break;
        } else {
          // invalid tag
          parsingError(ERROR_UNEXPECTED_CHAR);
        }
        break;

      case STATE_SELF_CLOSING:
        if (char === '>') {
          createToken('tag');
          state = STATE_TEXT;
        } else {
          // invalid tag
          parsingError(ERROR_UNEXPECTED_CHAR);
        }
        break;
    }
  }

  if (!END_STATES.has(state)) {
    parsingError(ERROR_UNEXPECTED_END);
  }
  createToken('text');

  return tokens;
}
