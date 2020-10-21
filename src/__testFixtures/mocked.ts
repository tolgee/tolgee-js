import {PluginManager} from "../core/toolsManager/PluginManager";
import {PolygloatConfig} from "../core/PolygloatConfig";
import {Properties} from "../core/Properties";
import {CoreService} from "../core/services/CoreService";
import {Observer} from "../core/Observer";
import {mocked} from "ts-jest/utils";
import {TranslationService} from "../core/services/TranslationService";
import {TextService} from "../core/services/TextService";
import {EventService} from "../core/services/EventService";
import {EventEmitter} from "../core/services/EventEmitter";

export const pluginManagerMock = mocked(PluginManager);
export const configMock = mocked(PolygloatConfig);
export const propertiesMock = mocked(Properties);
export const coreServiceMock = mocked(CoreService);
export const observerMock = mocked(Observer);
export const translationServiceMock = mocked(TranslationService);
export const textServiceMock = mocked(TextService);
export const eventServiceMock = mocked(EventService);
export const eventEmitterMock = mocked(EventEmitter);
export const polygloatConfigMock = mocked(PolygloatConfig);

export const getMockedInstance = <T>(constructor: new (...args) => T) => {
    return mocked(constructor).mock.instances[0];
}