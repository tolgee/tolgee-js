/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { RollupOptions, OutputOptions, ModuleFormat } from 'rollup';

//@ts-ignore
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

export const commonConfig = {
  watch: {
    clearScreen: false,
  },
  treeshake: 'smallest',
} as const;

export const commonPlugins = [
  replace({
    'process.env.TOLGEE_UI_VERSION': JSON.stringify(
      process.env.TOLGEE_UI_VERSION
    ),
    preventAssignment: true,
  }),
];

export const packageOutput = (
  name: string,
  env: 'production' | 'development' | undefined,
  format: ModuleFormat,
  ext: string,
  min: boolean
) => {
  const targets: OutputOptions[] = [
    {
      name: `@tolgee/${name}`,
      entryFileNames: `tolgee-${name}${env ? `.${env}` : ''}.${format}.${ext}`,
      format,
    },
  ];
  if (min) {
    targets.push({
      name: `@tolgee/${name}`,
      entryFileNames: `tolgee-${name}${
        env ? `.${env}` : ''
      }.${format}.min.${ext}`,
      format,
      plugins: [terser()],
    });
  }
  return targets;
};

type Props = {
  name: string;
  env?: 'development' | 'production';
  min?: boolean;
};

export const buildPackage = ({
  name,
  env,
  min = true,
}: Props): RollupOptions => ({
  ...commonConfig,
  output: [
    ...packageOutput(name, env, 'esm', 'js', min),
    ...packageOutput(name, env, 'umd', 'js', min),
    ...packageOutput(name, env, 'umd', 'cjs', min),
  ],
  plugins: commonPlugins,
});
