import {
  ModifierKey,
  ObserverOptions,
  ObserverOptionsInitial,
} from '../../types';

const defaultOptions: ObserverOptions = {
  tagAttributes: {
    textarea: ['placeholder'],
    input: ['value', 'placeholder'],
    img: ['alt'],
    '*': ['aria-label', 'title'],
  },
  highlightKeys: [ModifierKey.Alt] as ModifierKey[],
  highlightColor: 'rgb(255, 0, 0)',
  highlightWidth: 5,
  targetElement: document.body,
  inputPrefix: '%-%tolgee:',
  inputSuffix: '%-%',
  passToParent: ['option', 'optgroup'],
};

export const initOptions = (
  options?: ObserverOptionsInitial
): ObserverOptions => {
  return { ...defaultOptions, ...options };
};
