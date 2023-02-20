import { buildPackage } from './rollup.common';

export default [
  buildPackage({
    input: 'src/entry-development.ts',
    name: 'web.development',
  }),
  buildPackage({
    input: 'src/entry-production.ts',
    name: 'web.production',
  }),

  // in-context tools
  buildPackage({
    input: 'src/entry-tools.ts',
    name: 'in-context-tools',
  }),
];
