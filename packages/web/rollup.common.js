import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import sizes from 'rollup-plugin-bundle-size';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';

export const commonConfig = {
  watch: {
    clearScreen: false,
  },
  treeshake: {
    moduleSideEffects: false,
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
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    include: ['node_modules/**', '../../node_modules/**'],
    preventAssignment: true,
  }),
];

/**
 *
 * @param {string} name
 * @param {string} format
 * @param {string} ext
 */
const packageOutput = (name, format, ext) => {
  return [
    {
      name: `@tolgee/${name}`,
      file: `dist/tolgee-${name}.${format}.${ext}`,
      format,
      sourcemap: true,
    },
    {
      name: `@tolgee/${name}`,
      file: `dist/tolgee-${name}.${format}.min.${ext}`,
      format,
      sourcemap: true,
      plugins: [terser()],
    },
  ];
};

export const buildPackage = ({ input, name }) => ({
  ...commonConfig,
  input,
  output: [
    ...packageOutput(name, 'cjs', 'js'),
    ...packageOutput(name, 'cjs', 'cjs'),
    ...packageOutput(name, 'esm', 'js'),
    ...packageOutput(name, 'esm', 'mjs'),
    ...packageOutput(name, 'umd', 'js'),
  ],
  plugins: commonPlugins,
});
