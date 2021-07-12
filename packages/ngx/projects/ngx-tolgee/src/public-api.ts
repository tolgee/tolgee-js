/*
 * Public API Surface of ngx-tolgee
 */
import { TranslateService } from './lib/translate.service';
import { TranslatePipe } from './lib/translate.pipe';
import { STranslatePipe } from './lib/stranslate.pipe';
import { TolgeeConfig } from './lib/tolgeeConfig';

export * from './lib/ngx-tolgee.module';
export { TolgeeConfig };
export { TranslateService };
export { TranslatePipe };
export { STranslatePipe };
