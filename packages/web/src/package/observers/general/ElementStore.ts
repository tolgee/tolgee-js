import { TolgeeElement, ElementMeta } from '../../types';

export type RegistredElementsMap = Map<TolgeeElement, ElementMeta>;

export function ElementStore() {
  const registredElements: RegistredElementsMap = new Map();

  return Object.freeze({
    set(el: TolgeeElement, meta: ElementMeta) {
      registredElements.set(el, meta);
    },

    get(el: TolgeeElement | undefined) {
      return el && registredElements.get(el);
    },

    remove(el: TolgeeElement) {
      return registredElements.delete(el);
    },

    forEachElement(callback: (el: TolgeeElement, meta: ElementMeta) => void) {
      registredElements.forEach((value, key) => callback(key, value));
    },
  });
}

export type ElementStoreType = ReturnType<typeof ElementStore>;
