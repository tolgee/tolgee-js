module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./dist/tolgee-web.production.umd.cjs')
    : require('./dist/tolgee-web.development.umd.cjs');
