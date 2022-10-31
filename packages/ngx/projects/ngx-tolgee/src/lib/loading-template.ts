import { InjectionToken, ComponentRef } from '@angular/core';

export const TOLGEE_LOADING_TEMPLATE = new InjectionToken<{
  component: ComponentRef<unknown> | string;
}>('tolgee.loading-template');
