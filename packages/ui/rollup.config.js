import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tolgee-ui.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-ui.cjs.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      name: '@tolgee/ui',
      file: 'dist/tolgee-ui.umd.js',
      format: 'umd',
      sourcemap: true,
      globals: {
        '@tolgee/core': '@tolgee/core',
      },
    },
    {
      name: '@tolgee/ui',
      file: 'dist/tolgee-ui.umd.min.js',
      format: 'umd',
      sourcemap: true,
      globals: {
        '@tolgee/core': '@tolgee/core',
      },
      plugins: [terser()],
    },
  ],
  external: ['@tolgee/core'],
  plugins: [
    typescript({
      outDir: './',
      sourceMap: false,
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
