import { CacheDescriptorInternal } from './cache';

export class RecordFetchError extends Error {
  public name = 'RecordFetchError' as const;
  public language: string;
  public namespace: string | undefined;
  constructor(
    descriptor: CacheDescriptorInternal,
    public cause: any,
    public isDev: boolean = false
  ) {
    const { language, namespace } = descriptor;
    super(
      `Tolgee: Failed to fetch record for "${language}"${
        namespace && ` and "${namespace}"`
      }`
    );
    this.language = language;
    this.namespace = namespace;
  }
}

export class LanguageDetectorError extends Error {
  public name = 'LanguageDetectorError' as const;
  constructor(
    message: string,
    public cause: any
  ) {
    super(message);
  }
}

export class LanguageStorageError extends Error {
  public name = 'LanguageStorageError' as const;
  constructor(
    message: string,
    public cause: any
  ) {
    super(message);
  }
}

export type TolgeeError =
  | RecordFetchError
  | LanguageDetectorError
  | LanguageStorageError;
