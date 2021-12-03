'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/tolgee-i18next.cjs.min.js');
} else {
  module.exports = require('./dist/tolgee-i18next.cjs.js');
}
