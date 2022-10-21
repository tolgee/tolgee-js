import { buildMain, buildMinified } from './rollup.common';

export default [
  ...buildMain(),
  // skipping vanilla modules, so it's faster in development mode
];
