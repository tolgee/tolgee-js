import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { APP_BASE_CONFIG, tolgeeConfig } from './app.config.common';
import { provideTolgee, Tolgee } from '@tolgee/ngx';
import { FormatIcu } from '@tolgee/format-icu';

export const config = mergeApplicationConfig(APP_BASE_CONFIG, {
  providers: [
    provideServerRendering(),
    provideTolgee(() => Tolgee().use(FormatIcu()).init(tolgeeConfig)),
  ],
});
