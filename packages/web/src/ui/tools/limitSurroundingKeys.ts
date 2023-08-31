export type KeyInfo = {
  keyName: string;
  keyNamespace?: string;
};

export const limitSurroundingKeys = (data: KeyInfo[], current: KeyInfo) => {
  const index =
    data.findIndex(
      (item) =>
        item.keyName === current.keyName &&
        (item.keyNamespace || undefined) === (current.keyNamespace || undefined)
    ) || 0;

  // we are working with window of 100 translations (+50 and -50)
  let first = index - 50;
  let last = index + 50;

  if (first < 0) {
    // adjust window to zero
    last = last + (0 - first);
    first = 0;
  }
  if (last > data.length) {
    // adjust window to last item
    first = first - (last - data.length);
    last = data.length;
  }
  // readjust first if it is negative
  if (first < 0) {
    first = 0;
  }
  return data.slice(first, last);
};
