export type StateType = 'UNTRANSLATED' | 'TRANSLATED' | 'REVIEWED' | 'DISABLED';
export type StateInType = Exclude<StateType, 'UNTRANSLATED' | 'DISABLED'>;

type StateStruct = Record<
  StateType,
  {
    name: string;
    color: string;
    next: StateInType | null;
  }
>;

export const TRANSLATION_STATES: StateStruct = {
  DISABLED: {
    name: 'Disabled',
    color: '#7e7e7e',
    next: null,
  },
  UNTRANSLATED: {
    name: 'Untranslated',
    color: '#C4C4C4',
    next: null,
  },
  TRANSLATED: {
    name: 'Translated',
    color: '#FFCE00',
    next: 'REVIEWED',
  },
  REVIEWED: {
    name: 'Reviewed',
    color: '#17AD18',
    next: 'TRANSLATED',
  },
};

export const STATES_FOR_UPDATE = ['REVIEWED', 'TRANSLATED'];
