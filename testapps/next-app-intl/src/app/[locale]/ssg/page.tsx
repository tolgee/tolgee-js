import { ALL_LANGUAGES } from '@/tolgee/shared';

export const dynamic = 'error';

export function generateStaticParams() {
  return ALL_LANGUAGES.map((locale) => ({ locale }));
}

export default function StaticPage() {
  return <div>Static page</div>;
}
