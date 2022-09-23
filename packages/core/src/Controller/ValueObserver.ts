export const ValueObserver = <T = any>(
  initialValue: T,
  valueGetter: () => T,
  handler: (value: T) => void
) => {
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

export type ValueObserverInstance<T> = ReturnType<typeof ValueObserver<T>>;
