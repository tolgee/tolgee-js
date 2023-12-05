// https://next-intl-docs.vercel.app/docs/getting-started/app-router

import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { ALL_LOCALES } from './tolgee/shared';

export const locales = ALL_LOCALES;
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
