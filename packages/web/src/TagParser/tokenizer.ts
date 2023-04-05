const STATE_TEXT = 0,
  STATE_TAG_START = 1,
  STATE_TAG_NAME = 2,
  STATE_SELF_CLOSING = 3;

type State =
  | typeof STATE_TEXT
  | typeof STATE_TAG_START
  | typeof STATE_TAG_NAME
  | typeof STATE_SELF_CLOSING;

export type Token = {
  type: 'text' | 'tag';
  name: string;
  closing: boolean;
  selfClosing: boolean;
  position: number;
  text: string;
};

function isWhite(char: string) {
  return /\s/g.test(char);
}

function isNameChar(char: string) {
  return /[A-Za-z0-9]/.test(char);
}

export function tokenizer(source: string) {
  const tokens: Token[] = [];
  let state: State = STATE_TEXT;
  let name = '';
  let closing = false;
  let selfClosing = false;
  let tokenPosition = 0;
  let text = '';

  let i = 0;

  function createToken(type: Token['type']) {
    if (text.length) {
      tokens.push({
        type,
        name,
        closing,
        selfClosing,
        position: tokenPosition,
        text,
      });
      closing = false;
      selfClosing = false;
      name = '';
      tokenPosition = i;
      text = '';
    }
  }

  for (i = 0; i < source.length; i++) {
    const char = source[i];
    switch (state) {
      case STATE_TEXT:
        if (char === '<') {
          createToken('text');
          state = STATE_TAG_START;
        }
        text += char;
        break;

      case STATE_TAG_START:
        text += char;
        if (char === '/' && !closing) {
          closing = true;
        } else if (isNameChar(char)) {
          name += char;
          state = STATE_TAG_NAME;
        } else {
          // invalid tag
          state = STATE_TEXT;
        }
        break;

      case STATE_TAG_NAME:
        text += char;
        if (char === '>') {
          createToken('tag');
          state = STATE_TEXT;
        } else if (isNameChar(char)) {
          name += char.toLowerCase();
        } else if (char === '/' && name !== '') {
          // self-closing slash
          selfClosing = true;
          state = STATE_SELF_CLOSING;
        } else if (isWhite(char) && name !== '') {
          // skiping white spaces after tag name
          break;
        } else {
          // invalid tag - ignoring
          state = STATE_TEXT;
        }
        break;

      case STATE_SELF_CLOSING:
        text += char;
        if (char === '>') {
          createToken('tag');
          state = STATE_TEXT;
        } else {
          // invalid tag - ignoring
          state = STATE_TEXT;
        }
        break;
    }
  }
  createToken('text');
  return tokens;
}
