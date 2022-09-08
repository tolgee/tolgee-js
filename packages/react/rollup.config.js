import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tolgee-react.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tolgee-react.cjs.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      name: '@tolgee/react',
      file: 'dist/tolgee-react.umd.js',
      format: 'umd',
      sourcemap: true,
      globals: {
        '@tolgee/core': '@tolgee/core',
        '@tolgee/devtools-web': '@tolgee/devtools-web',
        react: 'React',
      },
    },
    {
      name: '@tolgee/react',
      file: 'dist/tolgee-react.umd.min.js',
      format: 'umd',
      sourcemap: true,
      globals: {
        '@tolgee/core': '@tolgee/core',
        '@tolgee/devtools-web': '@tolgee/devtools-web',
        react: 'React',
      },
      plugins: [terser()],
    },
    {
      name: '@tolgee/react',
      file: 'dist/tolgee-react.esm.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      name: '@tolgee/react',
      file: 'dist/tolgee-react.esm.min.mjs',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  watch: {
    clearScreen: false,
  },
  external: ['react', '@tolgee/core', '@tolgee/devtools-web'],
  plugins: [
    typescript({
      outDir: './lib',
    }),
    sourcemaps(),
  ],
};
