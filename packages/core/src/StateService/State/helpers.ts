import {
  FallbackGeneral,
  FallbackLanguage,
  FallbackLanguageObject,
  FallbackLanguageOption,
} from '../../types';

export function isObject(item: any) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

export function getFallback(value: FallbackGeneral): string[] | undefined {
  if (typeof value === 'string') {
    return [value];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return undefined;
}

export function getFallbackArray(value: FallbackGeneral): string[] {
  return getFallback(value) || [];
}

export function getFallbackFromStruct(
  language: string,
  fallbackLanguage: FallbackLanguageOption
) {
  if (isObject(fallbackLanguage)) {
    return getFallbackArray(
      (fallbackLanguage as FallbackLanguageObject)?.[language]
    );
  } else {
    return getFallbackArray(fallbackLanguage as FallbackLanguage);
  }
}

export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}
