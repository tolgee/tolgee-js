import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tolgee-devtools-web.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-devtools-web.cjs.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
    {
<<<<<<< HEAD:packages/ui/rollup.config.js
      file: 'dist/tolgee-ui.esm.mjs',
=======
      file: 'dist/tolgee-devtools-web.esm.mjs',
>>>>>>> 59dad807 (feat: split to modules):packages/devtools-web/rollup.config.js
      format: 'esm',
      sourcemap: true,
    },
    {
<<<<<<< HEAD:packages/ui/rollup.config.js
      file: 'dist/tolgee-ui.esm.min.mjs',
=======
      file: 'dist/tolgee-devtools-web.esm.min.mjs',
>>>>>>> 59dad807 (feat: split to modules):packages/devtools-web/rollup.config.js
      format: 'esm',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      name: '@tolgee/ui',
      file: 'dist/tolgee-devtools-web.umd.js',
      format: 'umd',
      sourcemap: true,
    },
    {
      name: '@tolgee/ui',
      file: 'dist/tolgee-devtools-web.umd.min.js',
      format: 'umd',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  watch: {
    clearScreen: false,
  },
  plugins: [
    typescript({
      outDir: './lib',
      sourceMap: true,
    }),
    nodeResolve(),
    commonjs({
      include: ['node_modules/**', '../../node_modules/**'],
    }),
    sourcemaps(),
  ],
};
