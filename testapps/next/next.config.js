/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'de', 'fr', 'cs'],
    localeDetection: true,
    defaultLocale: 'en',
  },
  distDir: process.env.NEXT_BUILD_DIR || '.next',
};
