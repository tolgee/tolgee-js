export function isSSR() {
  return typeof globalThis.window?.document?.createElement === 'undefined';
}

export function throwIfSSR(origin: string) {
  if (isSSR()) {
    throw new Error(`${origin}: Can't run on the server`);
  }
}
