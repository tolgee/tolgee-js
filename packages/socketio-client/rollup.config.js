import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tolgee-socketio-client.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-socketio-client.cjs.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      name: '@tolgee/socketio-client',
      file: 'dist/tolgee-socketio-client.umd.js',
      format: 'umd',
      sourcemap: true,
    },
  ],
  plugins: [
    builtins(),
    typescript({
      outDir: './',
    }),
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
    commonjs({
      ignore: ['bufferutil', 'utf-8-validate'],
    }),
  ],
};
