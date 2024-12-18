import { createNavigation } from 'next-intl/navigation';
import { ALL_LANGUAGES } from './tolgee/shared';

// read more about next-intl library
// https://next-intl-docs.vercel.app
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales: ALL_LANGUAGES,
});
