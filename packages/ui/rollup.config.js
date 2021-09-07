import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import react from 'react';
import reactDom from 'react-dom';

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
  ],
  external: ['@tolgee/core'],
  plugins: [
    typescript({
      outDir: './',
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        react: Object.keys(react),
        'react-dom': Object.keys(reactDom),
      },
    }),
  ],
};
