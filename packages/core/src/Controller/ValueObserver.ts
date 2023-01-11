export const ValueObserver = <T = any>(
  initialValue: T,
  valueGetter: () => T,
  handler: (value: T) => void
): ValueObserverInstance<T> => {
  let previousValue: T = initialValue;
  function init(value: T) {
    previousValue = value;
  }
  function notify() {
    const value = valueGetter();
    if (previousValue !== value) {
      handler(value);
    }
    previousValue = value;
  }
  return Object.freeze({
    init,
    notify,
  });
};

export type ValueObserverInstance<T> = {
  readonly init: (value: T) => void;
  readonly notify: () => void;
};
