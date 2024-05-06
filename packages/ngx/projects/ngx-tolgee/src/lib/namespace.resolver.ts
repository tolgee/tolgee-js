import { ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from './translate.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NamespaceResolver  {
  constructor(public service: TranslateService) {}

  async resolve(
    route: ActivatedRouteSnapshot,
  ): Promise<void> {
    const ns = this.getNamespace(route);
    await this.service.tolgee.addActiveNs(ns, true)
  }

  private getNamespace(route: ActivatedRouteSnapshot) {
    const namespace = route?.data?.tolgeeNamespace;
    if (namespace === undefined) {
      console.warn(
        'No namespace provided. Please add tolgeeNamespace to your route data. \n' +
          'If you really want to lazy load default namespace set tolgeeNamespace to empty string'
      );
    }
    return namespace;
  }
}
