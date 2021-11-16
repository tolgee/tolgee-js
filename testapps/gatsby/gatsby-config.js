require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.yourdomain.tld',
    title: 'Tolgee Gatsby TestApp',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-react-intl`,
      options: {
        path: `${__dirname}/src/i18n`,
        languages: [`en`, `de`, `cs`, `fr`],
        defaultLanguage: `en`,
        redirect: true,
      },
    },
  ],
};
