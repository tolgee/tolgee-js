'use server';

import { detectLanguageFromHeaders } from '@tolgee/react/server';
import { cookies, headers } from 'next/headers';
import { ALL_LOCALES, DEFAULT_LOCALE } from './shared';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export async function setLocale(locale: string) {
  const cookieStore = cookies();
  cookieStore.set({
    name: LOCALE_COOKIE,
    value: locale,
  });
}

export async function getLocale() {
  const cookieStore = cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (locale && ALL_LOCALES.includes(locale)) {
    return locale;
  } else {
    return (
      detectLanguageFromHeaders(await headers(), ALL_LOCALES) ?? DEFAULT_LOCALE
    );
  }
}
