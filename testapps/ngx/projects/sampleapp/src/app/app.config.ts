import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { routes } from './app.routes';
import { provideTolgee } from '@tolgee/ngx';
import { Tolgee, DevTools } from '@tolgee/ngx';
import { FormatIcu } from '@tolgee/format-icu';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideTolgee(() =>
      Tolgee()
        .use(FormatIcu())
        .use(DevTools())
        .init({
          availableLanguages: ['en', 'cs', 'fr', 'de'],
          staticData: {
            'en:namespaced': () =>
              import('../i18n/namespaced/en.json').then((m) => m.default),
            'cs:namespaced': () =>
              import('../i18n/namespaced/cs.json').then((m) => m.default),
            'de:namespaced': () =>
              import('../i18n/namespaced/de.json').then((m) => m.default),
            'fr:namespaced': () =>
              import('../i18n/namespaced/fr.json').then((m) => m.default),
            en: () => import('../i18n/en.json').then((m) => m.default),
            cs: () => import('../i18n/cs.json').then((m) => m.default),
            de: () => import('../i18n/de.json').then((m) => m.default),
            fr: () => import('../i18n/fr.json').then((m) => m.default),
          },
          apiUrl: environment.tolgeeApiUrl,
          apiKey: environment.tolgeeApiKey,
          fallbackLanguage: 'en',
          defaultLanguage: 'en',
        })
    ),
  ],
};
