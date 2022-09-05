export const ValueMemory = () => {
  const values: string[] = [];

  const valueToNumber = (key: string) => {
    let index = values.indexOf(key);
    if (index === -1) {
      index = values.length;
      values.push(key);
    }
    return index;
  };

  const numberToValue = (num: number) => {
    return values[num];
  };

  return Object.freeze({ valueToNumber, numberToValue });
};

export type ValueMemoryInstance = ReturnType<typeof ValueMemory>;
