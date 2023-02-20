module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./dist/tolgee-web.production.cjs.js')
    : require('./dist/tolgee-web.development.cjs.js');
