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
      file: 'dist/tolgee-storage-web.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-storage-web.cjs.min.js',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-storage-web.esm.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-storage-web.esm.min.mjs',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      name: '@tolgee/storage-web',
      file: 'dist/tolgee-storage-web.umd.js',
      format: 'umd',
      sourcemap: true,
    },
    {
      name: '@tolgee/storage-web',
      file: 'dist/tolgee-storage-web.umd.min.js',
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
