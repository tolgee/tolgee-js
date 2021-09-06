'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/tolgee-ui.cjs.min.js');
} else {
  module.exports = require('./dist/tolgee-ui.cjs.js');
}
