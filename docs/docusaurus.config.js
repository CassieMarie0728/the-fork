// @ts-check
// Load local polyfills first so global File/Blob are available to dependencies
require("./polyfills");
const prismRenderer = require("prism-react-renderer");
const lightCodeTheme = prismRenderer.themes.github;
const darkCodeTheme = prismRenderer.themes.dracula;

const isCI = process.env.CI === "true";

// Parse READTHEDOCS_CANONICAL_URL to separate origin (url) and any sub-path (baseUrl).
// Read the canonical URL from the environment (set by Read the Docs); if it contains
// a sub-path like "/en/latest/" Docusaurus requires the origin in `url` and the
// sub-path in `baseUrl`.
const _canonical = process.env.READTHEDOCS_CANONICAL_URL;
let siteUrl = "https://the-fork.readthedocs.io";
let siteBaseUrl = "/";
if (_canonical) {
  try {
    const parsed = new URL(_canonical);
    siteUrl = parsed.origin;
    siteBaseUrl = parsed.pathname.endsWith("/")
      ? parsed.pathname
      : parsed.pathname + "/";
  } catch (e) {
    // Fallback: if parsing fails, leave defaults
  }
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "The Fork",
  tagline: "A collaborative project combining frontend and backend services",
  favicon: "img/favicon.ico",
  url: siteUrl,
  baseUrl: siteBaseUrl,
  organizationName: "CassieMarie0728",
  projectName: "the-fork",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  trailingSlash: undefined,

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/CassieMarie0728/the-fork/tree/main/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "The Fork",
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://github.com/CassieMarie0728/the-fork",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting Started",
                to: "/docs/getting-started",
              },
              {
                label: "Architecture",
                to: "/docs/architecture",
              },
              {
                label: "API",
                to: "/docs/api",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/CassieMarie0728/the-fork",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} The Fork. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["python", "javascript", "jsx"],
      },
    }),
};

module.exports = config;
