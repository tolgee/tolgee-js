import { TolgeeConfig } from '../TolgeeConfig';
import { Properties } from '../Properties';
import { CoreService } from '../services/CoreService';
import { Observer } from '../Observer';
import { mocked } from 'ts-jest/utils';
import { TranslationService } from '../services/TranslationService';
import { TextService } from '../services/TextService';
import { EventService } from '../services/EventService';
import { EventEmitterImpl } from '../services/EventEmitter';

export const configMock = mocked(TolgeeConfig);
export const propertiesMock = mocked(Properties);
export const coreServiceMock = mocked(CoreService);
export const observerMock = mocked(Observer);
export const translationServiceMock = mocked(TranslationService);
export const textServiceMock = mocked(TextService);
export const eventServiceMock = mocked(EventService);
export const eventEmitterMock = mocked(EventEmitterImpl);
export const tolgeeConfigMock = mocked(TolgeeConfig);

export const getMockedInstance = <T>(constructor: new (...args) => T) => {
  return mocked(constructor).mock.instances[0];
};
