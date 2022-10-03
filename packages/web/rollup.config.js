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
  replace({
    'process.env.TOLGEE_UI_VERSION': JSON.stringify(
      process.env.TOLGEE_UI_VERSION
    ),
    preventAssignment: true,
  }),
];

/**
 * Template for rollup configuration for production minified build
 * @param {string} input Input file name
 * @param {string} name Name of the package
 */
const buildMinified = (input, name) => ({
  ...commonConfig,
  input,
  output: [
    {
      file: `dist/tolgee-${name}.cjs.min.js`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `dist/tolgee-${name}.esm.min.mjs`,
      format: 'esm',
      sourcemap: true,
    },
    {
      name: `@tolgee/tolgee-${name}`,
      file: `dist/tolgee-${name}.umd.min.js`,
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
});

export default [
  {
    ...commonConfig,
    output: [
      {
        file: 'dist/tolgee-web.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/tolgee-web.esm.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        name: '@tolgee/tolgee-web',
        file: 'dist/tolgee-web.umd.js',
        format: 'umd',
        sourcemap: true,
      },
    ],

    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        // replace only in libraries (not in our code)
        include: ['node_modules/**', '../../node_modules/**'],
        preventAssignment: true,
      }),
      ...commonPlugins,
    ],
  },
  // minified outputs
  buildMinified('src/index.ts', 'web'),
  buildMinified('src/InContextProduction.ts', 'in-context-production'),
  buildMinified('src/TextObserver.ts', 'text-observer'),
  buildMinified('src/InvisibleObserver.ts', 'invisible-observer'),
  buildMinified('src/ContextUi.ts', 'context-ui'),
  buildMinified('src/LanguageStorage.ts', 'language-storage'),
  buildMinified('src/LanguageDetector.ts', 'language-detector'),
  buildMinified('src/WebTolgee.ts', 'web-tolgee'),
  buildMinified('src/BackendFetch.ts', 'backend-fetch'),
  buildMinified('src/BackendFetch.ts', 'backend-fetch'),
  buildMinified('src/LanguageDetector.ts', 'language-detector'),
  buildMinified('src/LanguageStorage.ts', 'language-storage'),
];
