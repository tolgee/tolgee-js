import type { TranslationKey, TFnType, TranslateProps } from '../lib';

// Augmenting the interface narrows `TranslationKey` everywhere it is used.
declare module '../lib/types/general' {
  interface TranslationKeyConfig {
    key: 'hello' | 'world';
  }
}

type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
const assertType = <_T extends true>() => undefined;

assertType<Equals<TranslationKey, 'hello' | 'world'>>();

declare const t: TFnType<string, string, TranslationKey>;
t('hello');
t('world', 'default value');
// @ts-expect-error unknown key is rejected once the config narrows the type
t('nope');

const props: TranslateProps = { key: 'hello' };
// @ts-expect-error unknown key is rejected in the props object form too
const bad: TranslateProps = { key: 'nope' };

export { props, bad };
