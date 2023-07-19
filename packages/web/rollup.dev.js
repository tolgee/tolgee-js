import { buildPackage } from './rollup.common';

export default [
  buildPackage({
    input: 'src/entry-development.ts',
    name: 'web',
    env: 'development',
    min: false,
  }),
];
