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
        react: 'React',
      },
      plugins: [terser()],
    },
    {
      name: '@tolgee/react',
      file: 'dist/tolgee-react.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  watch: {
    clearScreen: false,
  },
  external: ['react', '@tolgee/core', '@tolgee/ui'],
  plugins: [
    typescript({
      outDir: './lib',
    }),
    sourcemaps(),
  ],
};
