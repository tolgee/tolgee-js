import { getRequestConfig } from 'next-intl/server';
import { getStaticData } from '../tolgee/shared';

export default getRequestConfig(async ({ locale }) => {
  return {
    // it's important you provide all data which are needed for initial render
    // so current locale and also fallback locales + necessary namespaces
    messages: await getStaticData(['en', locale]),
  };
});
