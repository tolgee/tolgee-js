import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { TolgeeInstance } from '@tolgee/web';
import { TOLGEE_INSTANCE } from './tolgee-instance-token';
import { TranslateService } from './translate.service';

export function provideTolgee(
  factory: () => TolgeeInstance | Promise<TolgeeInstance>
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TOLGEE_INSTANCE,
      useFactory: factory,
    },
    TranslateService,
    provideAppInitializer(() => inject(TranslateService).start()),
  ]);
}
