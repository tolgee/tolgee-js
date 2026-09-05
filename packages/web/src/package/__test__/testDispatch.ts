// jsdom's own postMessage carries no source or origin; a real browser stamps both, and the SDK checks them.
export const dispatchExtensionMessage = (type: string, data: unknown) =>
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { type, data },
      origin: window.location.origin,
      source: window,
    })
  );
