export function splitOnNonEscapedDelimiter(
  string: string,
  delimiter: string
): string[] {
  const result = [];
  let actual = '';
  let escaped = false;
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (char === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    if (escaped) {
      escaped = false;
      actual += char;
      continue;
    }
    if (char === delimiter) {
      result.push(actual);
      actual = '';
      continue;
    }
    actual += char;
  }
  result.push(actual);
  return result;
}

export function isCharEscaped(position: number, fullString: string) {
  let escapeCharsCount = 0;
  while (position > -1 && fullString[position - 1] === '\\') {
    escapeCharsCount++;
    position--;
  }
  return escapeCharsCount % 2 == 1;
}

export function removeEscapes(string: string) {
  let result = '';
  let escaped = false;
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (char === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    if (escaped) {
      escaped = false;
      result += char;
      continue;
    }
    result += char;
  }
  return result;
}
