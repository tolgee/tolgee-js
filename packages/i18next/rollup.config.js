import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tolgee-i18next.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-i18next.cjs.min.js',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-i18next.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-i18next.esm.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      name: '@tolgee/i18next',
      file: 'dist/tolgee-i18next.umd.js',
      format: 'umd',
      globals: {
        '@tolgee/core': '@tolgee/core',
      },
      sourcemap: true,
    },
    {
      name: '@tolgee/i18next',
      file: 'dist/tolgee-i18next.umd.min.js',
      format: 'umd',
      globals: {
        '@tolgee/core': '@tolgee/core',
      },
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  external: ['@tolgee/core'],
  plugins: [
    typescript({
      outDir: './',
      sourceMap: false,
    }),
    nodeResolve(),
  ],
};
