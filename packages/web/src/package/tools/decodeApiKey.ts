const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function readChar(char: string) {
  const idx = alphabet.indexOf(char);

  if (idx === -1) {
    throw new Error('Invalid character found: ' + char);
  }

  return idx;
}

function arrayBufferToString(buffer: any) {
  const bufView = new Uint8Array(buffer);
  const length = bufView.length;
  let result = '';
  let addition = Math.pow(2, 16) - 1;

  for (let i = 0; i < length; i += addition) {
    if (i + addition > length) {
      addition = length - i;
    }
    result += String.fromCharCode.apply(
      null,
      // @ts-ignore
      bufView.subarray(i, i + addition)
    );
  }

  return result;
}

function base32Decode(input: string) {
  input = input.toUpperCase();

  const length = input.length;

  let bits = 0;
  let value = 0;

  let index = 0;
  const output = new Uint8Array(((length * 5) / 8) | 0);

  for (let i = 0; i < length; i++) {
    value = (value << 5) | readChar(input[i]);
    bits += 5;

    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return arrayBufferToString(output.buffer);
}

export function getProjectIdFromApiKey(
  key: string | undefined
): number | undefined {
  if (!key) {
    return undefined;
  }
  try {
    const [prefix, rest] = key.split('_');
    if (prefix === 'tgpak') {
      const [projectId] = base32Decode(rest).split('_');
      return Number(projectId);
    }
  } catch {
    // eslint-disable-next-line no-console
    console.warn("Tolgee: Api key can't be parsed");
  }
  return undefined;
}

export function getApiKeyType(key: string | undefined) {
  if (!key) {
    return undefined;
  }
  const [prefix] = key.split('_');
  if (prefix === 'tgpak') {
    return 'tgpak';
  } else if (prefix === 'tgpat') {
    return 'tgpat';
  }

  return 'legacy';
}
