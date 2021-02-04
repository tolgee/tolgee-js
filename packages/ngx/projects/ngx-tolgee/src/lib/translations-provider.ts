import {Injectable} from '@angular/core';
import {TranslateService} from "./translate.service";
import {TolgeeConfig} from "@tolgee/core";

@Injectable()
export class TranslationsProvider {

  constructor(private translateService: TranslateService) {
  }

  async load(options: TolgeeConfig) {
    return await this.translateService.start(options);
  }
}


