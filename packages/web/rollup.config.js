import { buildPackage } from './rollup.common';

export default [
  // buildPackage({
  //   input: 'src/entry-development.ts',
  //   name: 'web.development',
  // }),
  buildPackage({
    input: 'src/entry-production.ts',
    name: 'web.production',
  }),
  // buildPackage({
  //   input: 'src/entry-universal.ts',
  //   name: 'web.universal',
  // }),

  // // in-context tools
  // buildPackage({
  //   input: 'src/entry-tools.ts',
  //   name: 'in-context-tools',
  // }),
];
