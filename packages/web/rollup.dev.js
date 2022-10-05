import { buildMain } from './rollup.common';

export default [
  buildMain(),
  buildMinified('src/index.ts', 'web'),
  // skipping vanilla modules, so it's faster in development mode
];
