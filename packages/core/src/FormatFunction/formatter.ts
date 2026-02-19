import { DefaultParamType, TranslateParams } from '../types';

export function formatter(
  translation: string | ((p?: typeof params) => string),
  params?: TranslateParams<DefaultParamType>
) {
  if (typeof (translation) === "function") {
    switch (translation.length) {
      case 0:
        if (params) {
          throw new Error(`Parameters were provided for translation ${translation.toString()}, but its function doesn't accept any arguments.`);
        }
        break;

      case 1:
        if (!params) {
          throw new Error(`Parameters were not provided for translation ${translation.toString()}, but its function needs arguments.`);
        }
        break;

      default:
        throw new Error(`For translation ${translation.toString()}: a translation function should have exactly one parameter, with translation parameters passed as keys.\n For example, ({name}) => \`hello \${name}\``);
    }
    return translation(params);
  }
  if (params) {
    throw new Error(`Params given to translation "${translation}" but it does not accept params. Use a function to accept params when using FormatFunction as Tolgee's formatter.`)
  }
  return translation;
}
