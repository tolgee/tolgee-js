export const TranslationMethodsServer = async () => {
  const t = (key: string) => key;

  return (
    <>
      <h1 className="section-title">Server</h1>
      <div className="tiles">
        <div>
          <h1>t function with noWrap</h1>
          <div>{t('this_is_a_key')}</div>
        </div>
      </div>
    </>
  );
};
