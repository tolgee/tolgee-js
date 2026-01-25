import { ResolveFn } from '@angular/router';
import { TranslateService } from './translate.service';
import { inject } from '@angular/core';

export const namespaceResolver: ResolveFn<void> = async (route) => {
  const service = inject(TranslateService);
  const namespace = route?.data?.tolgeeNamespace;
  if (namespace === undefined) {
    console.warn(
      `No namespace provided. Please add tolgeeNamespace to your route data.\nIf you really want to lazy load default namespace set tolgeeNamespace to empty string`
    );
  }

  await service.tolgee.addActiveNs(namespace, true);
};
