import { TolgeeElement, ElementMeta } from '../../types';

export type RegistredElementsMap = Map<TolgeeElement, ElementMeta>;

export const ElementStore = () => {
  const registredElements: RegistredElementsMap = new Map();

  function set(el: TolgeeElement, meta: ElementMeta) {
    registredElements.set(el, meta);
  }

  function get(el: TolgeeElement | undefined) {
    return el && registredElements.get(el);
  }

  function remove(el: TolgeeElement) {
    return registredElements.delete(el);
  }

  function forEachElement(
    callback: (el: TolgeeElement, meta: ElementMeta) => void
  ) {
    registredElements.forEach((value, key) => callback(key, value));
  }
  return Object.freeze({
    set,
    get,
    remove,
    forEachElement,
  });
};

export type ElementStoreType = ReturnType<typeof ElementStore>;
