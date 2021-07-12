export type ArgumentTypes<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A
  : never;

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
