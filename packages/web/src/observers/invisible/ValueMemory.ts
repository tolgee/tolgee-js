export function ValueMemory() {
  const values: string[] = [];

  return Object.freeze({
    valueToNumber(key: string) {
      let index = values.indexOf(key);
      if (index === -1) {
        index = values.length;
        values.push(key);
      }
      return index;
    },

    numberToValue(num: number) {
      return values[num];
    },
  });
}

export type ValueMemoryInstance = ReturnType<typeof ValueMemory>;
