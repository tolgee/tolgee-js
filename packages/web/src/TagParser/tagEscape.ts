const STATE_TEXT = 0,
  STATE_ESCAPE_MAYBE = 1;

type State = typeof STATE_TEXT | typeof STATE_ESCAPE_MAYBE;

export const CHAR_ESCAPE = '\\';

export const ESCAPABLE_CHARS = new Set(['<', '>', CHAR_ESCAPE]);

export function tagEscape(source: string) {
  let state: State = STATE_TEXT;
  let text = '';

  let i = 0;

  for (i = 0; i < source.length; i++) {
    const char = source[i];
    switch (state) {
      case STATE_TEXT:
        if (char === '<') {
          text += CHAR_ESCAPE;
        }
        if (char === CHAR_ESCAPE) {
          state = STATE_ESCAPE_MAYBE;
        }
        text += char;
        break;

      case STATE_ESCAPE_MAYBE:
        if (ESCAPABLE_CHARS.has(char)) {
          text = text.slice(0, -1) + char;
        } else {
          text += char;
        }
        state = STATE_TEXT;
    }
  }
  return text;
}
