import { TranslationTags, TranslationParamsTags, Unwrapped } from '../types';

export interface AbstractWrapper {
  handleText(node: Element): Promise<void>;
  handleSubtree(node: Element): Promise<void>;
  handleAttribute(node: Element): Promise<void>;
  wrap: (
    key: string,
    params?: TranslationParamsTags<any>,
    defaultValue?: string | undefined,
    translation?: TranslationTags<any>
  ) => TranslationTags<any>;
  unwrap(text: string): Unwrapped;
}
