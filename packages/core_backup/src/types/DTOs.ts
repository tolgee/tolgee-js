import { components } from './apiSchema.generated';

export class TranslationData {
  constructor(
    public key: string,
    public translations: { [key: string]: string },
    public id?: number
  ) {}
}

export type ComplexEditKeyDto = components['schemas']['ComplexEditKeyDto'];
export type KeyWithDataModel = components['schemas']['KeyWithDataModel'];
export type CreateKeyDto = components['schemas']['CreateKeyDto'];
export type SetTranslationsWithKeyDto =
  components['schemas']['SetTranslationsWithKeyDto'];
export type SetTranslationsResponseModel =
  components['schemas']['SetTranslationsResponseModel'];
export type KeyWithTranslationsModel =
  components['schemas']['KeyWithTranslationsModel'];

export type UploadedImageModel = components['schemas']['UploadedImageModel'];

export type PagedModelLanguageModel =
  components['schemas']['PagedModelLanguageModel'];
export type LanguageModel = components['schemas']['LanguageModel'];
