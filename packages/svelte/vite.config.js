import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  build: {
    target: 'es2017',
  },
  plugins: [sveltekit()],
};

export default config;
