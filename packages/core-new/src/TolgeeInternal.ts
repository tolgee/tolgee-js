import { runServices, stopServices } from './utils/serviceTools';
import { StateService } from './services/StateService';
import { initConfig, TolgeeConfig } from './TolgeeConfig';
import { ResourcesService } from './services/ResourcesService';

export const TolgeeInternal = (data: TolgeeConfig) => {
  const config = initConfig(data);
  const stateService = StateService({
    languageFuture: config.language || '',
    language: config.language || '',
    running: false,
  });
  const resourcesService = ResourcesService(config.apiUrl!, config.apiKey!);

  const loadTranslations = (language: string, scope: string) => {
    return resourcesService.loadBundle(language, scope);
  };

  const run = () => {
    runServices([stateService, resourcesService]);
  };

  const stop = () => {
    stopServices([stateService, resourcesService]);
  };

  return Object.freeze({ loadTranslations, run, stop });
};

export type TolgeeInternalImplementation = ReturnType<typeof TolgeeInternal>;
