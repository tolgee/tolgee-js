import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import sizes from 'rollup-plugin-bundle-size';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';

const commonConfig = {
  input: 'src/index.ts',
  watch: {
    clearScreen: false,
  },
};

const commonPlugins = [
  typescript({
    tsconfig: 'tsconfig.prod.json',
    outDir: './lib',
    sourceMap: true,
    noEmit: true,
    declaration: false,
    emitDeclarationOnly: false,
  }),
  nodeResolve(),
  commonjs({
    include: ['node_modules/**', '../../node_modules/**'],
  }),
  sourcemaps(),
  sizes(),
  visualizer(),
];

export default [
  {
    ...commonConfig,
    output: [
      {
        file: 'dist/tolgee-devtools-web.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/tolgee-devtools-web.esm.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        name: '@tolgee/ui',
        file: 'dist/tolgee-devtools-web.umd.js',
        format: 'umd',
        sourcemap: true,
      },
    ],

    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        include: ['node_modules/**', '../../node_modules/**'],
        preventAssignment: true,
      }),
      ...commonPlugins,
    ],
  },
  // minified outputs
  {
    ...commonConfig,
    output: [
      {
        file: 'dist/tolgee-devtools-web.cjs.min.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/tolgee-devtools-web.esm.min.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        name: '@tolgee/ui',
        file: 'dist/tolgee-devtools-web.umd.min.js',
        format: 'umd',
        sourcemap: true,
      },
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      terser(),
      ...commonPlugins,
    ],
  },
  {
    ...commonConfig,
    input: 'src/InContextProduction.ts',
    output: [
      {
        file: 'dist/tolgee-in-context-production.cjs.min.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/tolgee-in-context-production.esm.min.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        name: '@tolgee/ui',
        file: 'dist/tolgee-in-context-production.umd.min.js',
        format: 'umd',
        sourcemap: true,
      },
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      terser(),
      ...commonPlugins,
    ],
  },
];
