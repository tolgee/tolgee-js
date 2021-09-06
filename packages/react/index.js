'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/tolgee-react.cjs.min.js');
} else {
  module.exports = require('./dist/tolgee-react.cjs.js');
}
