import { ElementMeta, RegistredElementsMap, TolgeeElement } from '../../types';

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

  return Object.freeze({
    set,
    get,
    remove,
  });
};

export type ElementStoreType = ReturnType<typeof ElementStore>;
