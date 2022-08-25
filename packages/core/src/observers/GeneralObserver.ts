export const Observer = () => {
  let observer: MutationObserver | undefined;
  let isObserving = false;

  const createObserver = (): MutationObserver | undefined => {
    return new MutationObserver(async (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (!isObserving) {
          // make sure we don't touch the DOM after disconnect is called
          return;
        }
        switch (mutation.type) {
          case 'characterData':
            console.log(mutation);
            break;
          case 'childList':
            console.log(mutation);
            break;
          case 'attributes':
            console.log(mutation);
            break;
        }
      }
    });
  };

  const stop = () => {
    isObserving = false;
    observer?.disconnect();
    observer = undefined;
  };

  const start = () => {
    if (observer) {
      stop();
    }
    isObserving = true;
    observer = createObserver();
  };

  return Object.freeze({
    stop,
    start,
    isObserving: () => isObserving,
  });
};
