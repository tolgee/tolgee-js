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
 * @param {boolean} min
 */
const packageOutput = (name, env, format, ext, min) => {
  const targets = [
    {
      name: `@tolgee/${name}`,
      file: `dist/tolgee-${name}${env ? `.${env}` : ''}.${format}.${ext}`,
      format,
      sourcemap: true,
    },
  ];
  if (min) {
    targets.push({
      name: `@tolgee/${name}`,
      file: `dist/tolgee-${name}${env ? `.${env}` : ''}.${format}.min.${ext}`,
      format,
      sourcemap: true,
      plugins: [terser()],
    });
  }
  return targets;
};

export const buildPackage = ({ input, name, env, min = true }) => ({
  ...commonConfig,
  input,
  output: [
    ...packageOutput(name, env, 'cjs', 'js', min),
    ...packageOutput(name, env, 'esm', 'js', min),
    ...packageOutput(name, env, 'esm', 'mjs', min),
    ...packageOutput(name, env, 'umd', 'js', min),
  ],
  plugins: commonPlugins,
});
