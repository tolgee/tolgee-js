import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import vue from 'rollup-plugin-vue';
import sourcemaps from 'rollup-plugin-sourcemaps';

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
      file: 'dist/tolgee-vue.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      name: '@tolgee/vue',
      file: 'dist/tolgee-vue.esm.min.js',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  external: ['vue', '@tolgee/core', '@tolgee/ui'],
  watch: {
    clearScreen: false,
  },
  plugins: [
    typescript({
      outDir: './lib',
      sourceMap: true,
    }),
    vue(),
    sourcemaps(),
  ],
};
