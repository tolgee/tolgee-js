export type EventType = keyof Events;

export interface Events {
  connect_error: any;
  connect: undefined;
  translation_created: TranslationType;
  translation_modified: TranslationType;
  translation_deleted: TranslationType;
  key_created: KeyType;
  key_modified: KeyType & { oldName: string };
  key_deleted: KeyType;
  reconnect_attempt: number;
}

type KeyType = {
  id: number;
  name: string;
};

type TranslationType = {
  id: number;
  text: string;
  state: TranslationStateType;
  key: KeyType;
};

type TranslationStateType =
  | 'UNTRANSLATED'
  | 'MACHINE_TRANSLATED'
  | 'TRANSLATED'
  | 'REVIEWED'
  | 'NEEDS_REVIEW';
