import { useTranslation } from 'react-i18next';

const Namespaces = () => {
  const { t } = useTranslation('namespaced');

  return (
    <div className="tiles namespaces">
      <div>
        <h1>t function with namespace</h1>
        <div>{t('this_is_a_key', { ns: 'namespaced' })}</div>
      </div>

      <div>
        <h1>t function with default namespace</h1>
        <div>{t('this_is_a_key', { ns: 'translation' })}</div>
      </div>
    </div>
  );
};

export default Namespaces;
