import { Options, State } from '../types';
import { cacheInit } from './Cache/Cache';

export const initState = (options: Options): State => {
  const language = options.language || options.defaultLanguage || 'en';
  return {
    initialOptions: options,
    language,
    pendingLanguage: language,
    cache: cacheInit(options.staticData),
  };
};
