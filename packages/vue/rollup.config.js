import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import vue from 'rollup-plugin-vue';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import sizes from 'rollup-plugin-bundle-size';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tolgee-vue.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-vue.cjs.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      name: '@tolgee/vue',
      file: 'dist/tolgee-vue.esm.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      name: '@tolgee/vue',
      file: 'dist/tolgee-vue.esm.min.mjs',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      name: '@tolgee/vue',
      file: 'dist/tolgee-vue.umd.js',
      format: 'umd',
      sourcemap: true,
      globals: {
        vue: 'vue',
        '@tolgee/web': '@tolgee/web',
      },
    },
    {
      name: '@tolgee/vue',
      file: 'dist/tolgee-vue.umd.min.js',
      format: 'umd',
      sourcemap: true,
      globals: {
        vue: 'vue',
        '@tolgee/web': '@tolgee/web',
      },
      plugins: [terser()],
    },
  ],
  external: ['vue'],
  watch: {
    clearScreen: false,
  },
  plugins: [
    nodeResolve({
      resolveOnly: ['@tolgee/web'],
    }),
    typescript({
      outDir: './lib',
      sourceMap: true,
    }),
    vue(),
    sourcemaps(),
    sizes(),
  ],
};
