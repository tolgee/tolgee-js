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
      file: 'dist/tolgee-detector-web.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-detector-web.cjs.min.js',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-detector-web.esm.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-detector-web.esm.min.mjs',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      name: '@tolgee/detector-web',
      file: 'dist/tolgee-detector-web.umd.js',
      format: 'umd',
      sourcemap: true,
    },
    {
      name: '@tolgee/detector-web',
      file: 'dist/tolgee-detector-web.umd.min.js',
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
