/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { RollupOptions, OutputOptions, ModuleFormat } from 'rollup';

//@ts-ignore
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

export const commonConfig = {
  watch: {
    clearScreen: false,
  },
  external: ['@tolgee/core'],
  treeshake: 'smallest',
} as const satisfies RollupOptions;

export const commonPlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    include: ['../../**'],
    preventAssignment: true,
  }),
];

export const packageOutput = (
  name: string,
  env: 'production' | 'development' | undefined,
  format: ModuleFormat,
  ext: string,
  variants: ('min' | 'normal')[]
) => {
  const targets: OutputOptions[] = [];

  if (variants.includes('normal')) {
    targets.push({
      name: `@tolgee/${name}`,
      entryFileNames: `tolgee-${name}${env ? `.${env}` : ''}.${format}.${ext}`,
      format,
      globals: {
        '@tolgee/core': '@tolgee/core',
      },
    });
  }
  if (variants.includes('min')) {
    targets.push({
      name: `@tolgee/${name}`,
      entryFileNames: `tolgee-${name}${
        env ? `.${env}` : ''
      }.${format}.min.${ext}`,
      format,
      plugins: [terser()],
      globals: {
        '@tolgee/core': '@tolgee/core',
      },
    });
  }
  return targets;
};

type Props = {
  name: string;
  env?: 'development' | 'production';
  min?: boolean;
};

export const buildPackage = ({ name, env }: Props): RollupOptions => ({
  ...commonConfig,
  output: [
    ...packageOutput(name, env, 'esm', 'js', ['min', 'normal']),
    ...packageOutput(name, env, 'umd', 'js', ['min']),
    ...packageOutput(name, env, 'umd', 'cjs', ['normal']),
  ],
  plugins: commonPlugins,
});
