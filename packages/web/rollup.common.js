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

const replaceEnv = (value, modulesOnly) =>
  replace({
    'process.env.NODE_ENV': JSON.stringify(value),
    include: modulesOnly
      ? ['node_modules/**', '../../node_modules/**']
      : undefined,
    preventAssignment: true,
  });

const buildMin = ({ input, name, plugins = [], umdName, esmExt = 'mjs' }) => ({
  ...commonConfig,
  input,
  output: [
    {
      file: `dist/tolgee-${name}.cjs.min.js`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `dist/tolgee-${name}.esm.min.${esmExt}`,
      format: 'esm',
      sourcemap: true,
    },
    {
      name: `@tolgee/${umdName || name}`,
      file: `dist/tolgee-${name}.umd.min.js`,
      format: 'umd',
      sourcemap: true,
    },
  ],
  plugins: [...plugins, terser(), ...commonPlugins],
});

const buildDev = ({ input, name, plugins = [], umdName, esmExt = 'mjs' }) => ({
  ...commonConfig,
  input,
  output: [
    {
      file: `dist/tolgee-${name}.cjs.js`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `dist/tolgee-${name}.esm.${esmExt}`,
      format: 'esm',
      sourcemap: true,
    },
    {
      name: `@tolgee/${umdName || name}`,
      file: `dist/tolgee-${name}.umd.js`,
      format: 'umd',
      sourcemap: true,
    },
  ],
  plugins: [...plugins, ...commonPlugins],
});
/**
 * Template for rollup configuration for production minified build
 * @param {string} input Input file name
 * @param {string} name Name of the package
 */
export const buildVanilla = (input, name) => [
  buildDev({
    input,
    name,
    plugins: [replaceEnv('production', true), replaceEnv('development')],
  }),
  buildMin({ input, name, plugins: [replaceEnv('production')] }),
];

export const buildMain = () => [
  buildDev({
    input: 'src/index.ts',
    name: 'web.main',
    plugins: [replaceEnv('production', true)],
    umdName: 'web',
    esmExt: 'js',
  }),
  buildMin({
    input: 'src/index.ts',
    name: 'web.main',
    plugins: [replaceEnv('production', true)],
    umdName: 'web',
    esmExt: 'js',
  }),
];
