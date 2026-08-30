import { useTranslate, T } from '@tolgee/react';

// Declared inline so the tolgee-cli extractor can resolve `NS.NAMESPACED` —
// cross-file resolution is not yet supported. See ../i18n/namespaces.ts for
// the shared definition (mirror this entry there when adding new namespaces).
const NS = { NAMESPACED: 'namespaced' } as const;

export const Namespaces = () => {
  const { t } = useTranslate(NS.NAMESPACED);

  return (
    <div className="tiles namespaces">
      <div>
        <h1>t function with namespace</h1>
        <div>{t('this_is_a_key')}</div>
      </div>

      <div>
        <h1>t function with default namespace</h1>
        <div>{t('this_is_a_key', { ns: '' })}</div>
      </div>

      <div>
        <h1>T component with namespace</h1>
        <div>
          <T keyName="this_is_a_key" ns={NS.NAMESPACED} />
        </div>
      </div>
    </div>
  );
};
