import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

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
      sourcemap: true,
      plugins: [terser()],
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
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript({
      outDir: './',
    }),
    nodeResolve(),
  ],
};
