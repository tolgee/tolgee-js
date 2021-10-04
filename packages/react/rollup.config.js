import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

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
  ],
  external: ['react', '@tolgee/core'],
  plugins: [
    typescript({
      outDir: './',
      sourceMap: false,
    }),
  ],
};
