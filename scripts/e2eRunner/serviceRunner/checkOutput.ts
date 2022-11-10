export const checkOutput = (output: string, regexOrString: string | RegExp) => {
  if (typeof output === 'string') {
    if (regexOrString instanceof RegExp) {
      if (output.match(regexOrString)) {
        return true;
      }
    } else if (typeof regexOrString == 'string') {
      if (output.includes(regexOrString)) {
        return true;
      }
    }
  }
  return false;
};
