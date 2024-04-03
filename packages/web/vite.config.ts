import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { buildPackage } from './rollup.common';
import { RollupOptions } from 'rollup';

type Props = {
  entry: string;
  rollupOptions: RollupOptions;
};

// reused for vite.config.tools & vite.config.production
export const createConfig = ({ entry, rollupOptions }: Props) =>
  defineConfig({
    build: {
      emptyOutDir: false,
      lib: {
        entry,
      },
      rollupOptions,
    },
    plugins: [react()],
  });

// https://vitejs.dev/config/
export default createConfig({
  entry: resolve(__dirname, 'src/entry-development.ts'),
  rollupOptions: buildPackage({
    name: 'web',
    env: 'development',
  }),
});
