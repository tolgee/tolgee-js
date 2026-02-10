import { mergeApplicationConfig } from '@angular/core';
import { provideTolgee, Tolgee, DevTools } from '@tolgee/ngx';
import { FormatIcu } from '@tolgee/format-icu';
import { APP_BASE_CONFIG, tolgeeConfig } from './app.config.common';

export const appConfig = mergeApplicationConfig(APP_BASE_CONFIG, {
  providers: [
    // Add DevTools for browser/development
    provideTolgee(() =>
      Tolgee().use(FormatIcu()).use(DevTools()).init(tolgeeConfig)
    ),
  ],
});
