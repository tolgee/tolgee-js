export const checkOutput = (output: string, regexOrString: string | RegExp) => {
  if (typeof output !== 'string') {
    return false;
  }

  // Some CLIs print colored output or cursor-control escapes; strip those for stable matching.
  const normalizedOutput = output
    // eslint-disable-next-line no-control-regex
    .replace(/\x1B\[[0-9;]*[A-Za-z]/g, '')
    .replace(/\r/g, '');

  if (typeof regexOrString === 'string') {
    return normalizedOutput.includes(regexOrString);
  }

  return (
    regexOrString &&
    typeof (regexOrString as RegExp).test === 'function' &&
    (regexOrString as RegExp).test(normalizedOutput)
  );
};
