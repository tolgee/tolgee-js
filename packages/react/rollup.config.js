import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';
import sizes from 'rollup-plugin-bundle-size';

function build(input, output) {
  return {
    input: `src/${input}.ts`,
    output: [
      {
        file: `dist/${output}.cjs.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `dist/${output}.cjs.min.js`,
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        name: '@tolgee/react',
        file: `dist/${output}.umd.js`,
        format: 'umd',
        sourcemap: true,
        globals: {
          react: 'React',
          '@tolgee/web': '@tolgee/web',
        },
      },
      {
        name: '@tolgee/react',
        file: `dist/${output}.umd.min.js`,
        format: 'umd',
        sourcemap: true,
        plugins: [terser()],
        globals: {
          react: 'React',
          '@tolgee/web': '@tolgee/web',
        },
      },
      {
        name: '@tolgee/react',
        file: `dist/${output}.esm.js`,
        format: 'esm',
        sourcemap: true,
      },
      {
        name: '@tolgee/react',
        file: `dist/${output}.esm.min.js`,
        format: 'esm',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        name: '@tolgee/react',
        file: `dist/${output}.esm.mjs`,
        format: 'esm',
        sourcemap: true,
      },
      {
        name: '@tolgee/react',
        file: `dist/${output}.esm.min.mjs`,
        format: 'esm',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    watch: {
      clearScreen: false,
    },
    external: ['react', '@tolgee/web'],
    plugins: [
      typescript({
        outDir: './lib',
      }),
      sourcemaps(),
      sizes(),
    ],
  };
}

export default [
  build('index', 'tolgee-react'),
  build('server', 'tolgee-react-server'),
];
