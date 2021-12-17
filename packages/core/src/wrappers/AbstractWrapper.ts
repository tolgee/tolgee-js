import { TranslationParams, Unwrapped } from '../types';

export interface AbstractWrapper {
  handleText(node: Element): Promise<void>;
  handleSubtree(node: Element): Promise<void>;
  handleAttribute(node: Element): Promise<void>;
  wrap(
    key: string,
    params?: TranslationParams,
    defaultValue?: string | undefined,
    translation?: string
  ): string;
  unwrap(text: string): Unwrapped;
}
