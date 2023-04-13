export const ValueObserver = <T = any>(
  initialValue: T,
  valueGetter: () => T,
  handler: (value: T) => void
): ValueObserverInstance<T> => {
  let previousValue: T = initialValue;

  return Object.freeze({
    init(value: T) {
      previousValue = value;
    },
    notify() {
      const value = valueGetter();
      if (previousValue !== value) {
        handler(value);
      }
      previousValue = value;
    },
  });
};

export type ValueObserverInstance<T> = {
  readonly init: (value: T) => void;
  readonly notify: () => void;
};
