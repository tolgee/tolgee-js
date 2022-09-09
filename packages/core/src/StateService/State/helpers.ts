import {
  FallbackGeneral,
  FallbackLanguage,
  FallbackLanguageObject,
  FallbackLanguageOption,
} from '../../types';

export function isObject(item: any) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

export function getFallback(fallbackLanguage: FallbackGeneral): string[] {
  if (typeof fallbackLanguage === 'string') {
    return [fallbackLanguage];
  }
  if (Array.isArray(fallbackLanguage)) {
    return fallbackLanguage;
  }
  return [];
}

export function getFallbackFromStruct(
  language: string,
  fallbackLanguage: FallbackLanguageOption
) {
  if (isObject(fallbackLanguage)) {
    return getFallback(
      (fallbackLanguage as FallbackLanguageObject)?.[language]
    );
  } else {
    return getFallback(fallbackLanguage as FallbackLanguage);
  }
}

export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}
