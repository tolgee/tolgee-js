import createMiddleware from 'next-intl/middleware';
import { ALL_LANGUAGES, DEFAULT_LANGUAGE } from '@/tolgee/shared';

// read more about next-intl middleware configuration
// https://next-intl-docs.vercel.app/docs/routing/middleware#locale-prefix
export default createMiddleware({
  locales: ALL_LANGUAGES,
  defaultLocale: DEFAULT_LANGUAGE,
  localePrefix: 'as-needed',
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
