import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { buildPackage } from './rollup.common';
import { RollupOptions } from 'rollup';
import { replaceCodePlugin } from 'vite-plugin-replace';

type Props = {
  entry: string;
  rollupOptions: RollupOptions;
};

// reused for vite.config.tools & vite.config.production
export const createConfig = ({ entry, rollupOptions }: Props) =>
  defineConfig({
    clearScreen: false,
    build: {
      target: 'es2017',
      emptyOutDir: false,
      minify: false,
      sourcemap: true,
      lib: {
        entry,
      },
      rollupOptions,
    },
    plugins: [
      // this check in emotion package is not safe enough
      // https://github.com/emotion-js/emotion/issues/3196
      replaceCodePlugin({
        replacements: [
          {
            from: "typeof HTMLElement !== 'undefined'",
            to: "(typeof document !== 'undefined' && typeof HTMLElement !== 'undefined')",
          },
        ],
      }),
      react(),
      replaceCodePlugin({
        replacements: [
          {
            from: 'process.env.TOLGEE_UI_VERSION',
            to: JSON.stringify(process.env.TOLGEE_UI_VERSION) || 'undefined',
          },
        ],
      }),
    ],
  });

export default createConfig({
  entry: resolve(__dirname, 'src/package/entry-development.ts'),
  rollupOptions: buildPackage({
    name: 'web',
    env: 'development',
  }),
});
