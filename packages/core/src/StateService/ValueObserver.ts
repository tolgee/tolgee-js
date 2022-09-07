export const ValueObserver = <T>(handler: (value: T) => void) => {
  let previousValue: T;
  function init(value: T) {
    previousValue = value;
  }
  function update(value: T) {
    if (previousValue !== value) {
      handler(value);
    }
    previousValue = value;
  }
  return Object.freeze({
    init,
    update,
  });
};
