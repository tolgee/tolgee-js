import { buildPackage } from './rollup.common';

export default [
  buildPackage({
    input: 'src/entry-development.ts',
    name: 'web',
    env: 'development',
  }),
  buildPackage({
    input: 'src/entry-production.ts',
    name: 'web',
    env: 'production',
  }),

  // in-context tools
  buildPackage({
    input: 'src/entry-tools.ts',
    name: 'in-context-tools',
  }),
];
