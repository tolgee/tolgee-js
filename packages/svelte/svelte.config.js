import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  plugins: [],

  kit: {
    package: {
      files: (filepath) => {
        return !/^(.*\.(test.ts|spec.ts)|.*__.*)$/.test(filepath);
      },
    },
  },
};

export default config;
