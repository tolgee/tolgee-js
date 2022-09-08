export const ValueObserver = <T = any>(
  initialValue: T,
  handler: (value: T) => void
) => {
  let previousValue: T = initialValue;
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
