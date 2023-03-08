import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import sizes from 'rollup-plugin-bundle-size';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  input: 'src/index.ts',
  preserveSymlinks: true,
  output: [
    {
      file: 'dist/tolgee-format-icu.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-format-icu.cjs.min.js',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-format-icu.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-format-icu.esm.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-format-icu.esm.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-format-icu.esm.min.mjs',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      name: '@tolgee/format-icu',
      file: 'dist/tolgee-format-icu.umd.js',
      format: 'umd',
      sourcemap: true,
    },
    {
      name: '@tolgee/format-icu',
      file: 'dist/tolgee-format-icu.umd.min.js',
      format: 'umd',
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  watch: {
    clearScreen: false,
  },
  plugins: [
    typescript({
      outDir: './lib',
      sourceMap: true,
      noEmit: true,
      tsconfig: 'tsconfig.prod.json',
    }),
    nodeResolve(),
    sizes(),
    visualizer(),
  ],
};
