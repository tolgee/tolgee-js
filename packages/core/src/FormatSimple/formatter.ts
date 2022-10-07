import { DefaultParamType, TranslateParams } from '../types';
import { formatParser } from './formatParser';

export function formatter(
  translation: string,
  params?: TranslateParams<DefaultParamType>
) {
  const [texts, pars] = formatParser(translation);
  const result = [texts[0]];
  for (let i = 1; i < texts.length; i++) {
    const parameter = params?.[pars[i - 1]];
    if (parameter === undefined) {
      throw new Error(`Missing parameter "${pars[i - 1]}" in "${translation}"`);
    }
    result.push(String(parameter));
    result.push(texts[i]);
  }
  return result.join('');
}
