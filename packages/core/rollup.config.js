import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tolgee.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee.cjs.min.js',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'dist/tolgee.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee.esm.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      name: '@tolgee/core',
      file: 'dist/tolgee.umd.js',
      format: 'umd',
      sourcemap: true,
    },
    {
      name: '@tolgee/core',
      file: 'dist/tolgee.umd.min.js',
      format: 'umd',
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  watch: {
    clearScreen: false,
  },
  plugins: [
    replace({
      'process.env.TOLGEE_UI_VERSION': JSON.stringify(
        process.env.TOLGEE_UI_VERSION
      ),
    }),
    typescript({
      outDir: './',
      sourceMap: false,
    }),
    nodeResolve(),
  ],
};
