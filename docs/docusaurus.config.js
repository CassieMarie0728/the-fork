// @ts-check
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const isCI = process.env.CI === 'true';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Fork',
  tagline: 'A collaborative project combining frontend and backend services',
  favicon: 'img/favicon.ico',
  url: process.env.READTHEDOCS_CANONICAL_URL || 'https://the-fork.readthedocs.io',
  baseUrl: process.env.READTHEDOCS_BUILD_DIR ? '/' : '/',
  organizationName: 'CassieMarie0728',
  projectName: 'the-fork',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: undefined,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/CassieMarie0728/the-fork/tree/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'The Fork',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/CassieMarie0728/the-fork',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/getting-started',
              },
              {
                label: 'Architecture',
                to: '/docs/architecture',
              },
              {
                label: 'API',
                to: '/docs/api',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/CassieMarie0728/the-fork',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} The Fork. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['python', 'javascript', 'jsx'],
      },
    }),
};

module.exports = config;
