export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeFoundIn(contextNode: Node): R;
    }
  }
}
