import { ObserverOptions, ModifierKey } from '../../types';

const defaultOptions: ObserverOptions = {
  tagAttributes: {
    textarea: ['placeholder'],
    input: ['value', 'placeholder'],
    img: ['alt'],
    '*': ['aria-label', 'title'],
  },
  restrictedElements: ['script', 'style'],
  highlightKeys: [ModifierKey.Alt] as ModifierKey[],
  highlightColor: 'rgb(255, 0, 0)',
  highlightWidth: 5,
  inputPrefix: '%-%tolgee:',
  inputSuffix: '%-%',
  passToParent: ['option', 'optgroup'],
};

export const initOptions = (
  options?: Partial<ObserverOptions>
): ObserverOptions => {
  return { ...defaultOptions, ...options };
};
