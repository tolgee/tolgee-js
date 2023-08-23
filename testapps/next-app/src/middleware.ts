import createMiddleware from 'next-intl/middleware';
import { ALL_LOCALES, DEFAULT_LOCALE } from 'tolgee/shared';

export default createMiddleware({
  locales: ALL_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
