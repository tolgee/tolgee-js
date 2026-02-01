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
            'en:namespaced': () => import('../i18n/namespaced/en.json'),
            'cs:namespaced': () => import('../i18n/namespaced/cs.json'),
            'de:namespaced': () => import('../i18n/namespaced/de.json'),
            'fr:namespaced': () => import('../i18n/namespaced/fr.json'),
            en: () => import('../i18n/en.json'),
            cs: () => import('../i18n/cs.json'),
            de: () => import('../i18n/de.json'),
            fr: () => import('../i18n/fr.json'),
          },
          apiUrl: environment.tolgeeApiUrl,
          apiKey: environment.tolgeeApiKey,
          fallbackLanguage: 'en',
          defaultLanguage: 'en',
        })
    ),
  ],
};
