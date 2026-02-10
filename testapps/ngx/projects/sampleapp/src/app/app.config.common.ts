import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TolgeeOptions } from '@tolgee/ngx';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const tolgeeConfig: TolgeeOptions = {
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
};

export const APP_BASE_CONFIG: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(),
    provideRouter(routes),
  ],
};
