import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';
import sizes from 'rollup-plugin-bundle-size';

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
      file: 'dist/tolgee-i18next.esm.min.mjs',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      name: '@tolgee/i18next',
      file: 'dist/tolgee-i18next.umd.js',
      format: 'umd',
      globals: {
        '@tolgee/web': '@tolgee/web',
      },
      sourcemap: true,
    },
    {
      name: '@tolgee/i18next',
      file: 'dist/tolgee-i18next.umd.min.js',
      format: 'umd',
      globals: {
        '@tolgee/web': '@tolgee/web',
      },
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  watch: {
    clearScreen: false,
  },
  external: ['@tolgee/web'],
  plugins: [
    typescript({
      outDir: './lib',
      sourceMap: true,
    }),
    sourcemaps(),
    sizes(),
  ],
};
