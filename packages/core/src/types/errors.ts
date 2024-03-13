import { CacheDescriptorInternal } from './cache';

export class RecordFetchError extends Error {
  public name = 'RecordFetchError' as const;
  public language: string;
  public namespace: string | undefined;
  constructor(
    originalError: Error | undefined,
    descriptor: CacheDescriptorInternal,
    public isDev: boolean = false
  ) {
    const { language, namespace } = descriptor;
    super(
      originalError?.message ??
        `Failed to fetch record for ${language} and ${namespace}`
    );
    this.language = language;
    this.namespace = namespace;
    if (originalError instanceof Error) {
      this.stack = originalError?.stack;
      // Set the prototype explicitly.
      Object.setPrototypeOf(this, RecordFetchError.prototype);
    }
  }
}

export type TolgeeError = RecordFetchError;
