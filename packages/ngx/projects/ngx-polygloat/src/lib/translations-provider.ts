import {Injectable} from '@angular/core';
import {TranslateService} from "./translate.service";
import {PolygloatConfig} from "@polygloat/core";

@Injectable()
export class TranslationsProvider {

  constructor(private translateService: TranslateService) {
  }

  async load(options: PolygloatConfig) {
    return await this.translateService.start(options);
  }
}


