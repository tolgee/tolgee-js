/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./dist/tolgee-web.production.cjs')
    : require('./dist/tolgee-web.development.cjs');
