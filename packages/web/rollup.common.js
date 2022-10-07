import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import sizes from 'rollup-plugin-bundle-size';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';

export const commonConfig = {
  input: 'src/index.ts',
  watch: {
    clearScreen: false,
  },
};

export const commonPlugins = [
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
export const buildMinified = (input, name) => ({
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
      name: `@tolgee/${name}`,
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

export const buildMain = () => {
  return {
    ...commonConfig,
    output: [
      {
        file: 'dist/tolgee-web.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/tolgee-web.esm.js',
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
  };
};
