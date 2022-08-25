import { defineConfig } from "vitepress";
import pkg from "../../package.json";

export default defineConfig({
  lang: "en-US",
  title: "Discord Player Plus",
  description: pkg.description,
  lastUpdated: true,

  themeConfig: {
    logo: "/logo.png",
    socialLinks: [
      {
        icon: "github",
        link: pkg.repository.url,
      },
      {
        icon: "discord",
        link: "https://discord.com/users/251414332955557889",
      },
    ],
    editLink: {
      pattern: `${pkg.repository.url}/edit/main/docs/:path`,
    },
    footer: {
      message: `Released under the ${pkg.license} License.`,
      copyright: `Copyright © 2022-present ${pkg.author.name}`,
    },
    algolia: {
      appId: "SFDITE1CIH",
      apiKey: "7ef775ec258b6e7ecf4cfc88bdb00be3",
      indexName: "discordplayerplus",
    },
    nav: [
      {
        text: "Changelog",
        link: "https://github.com/larsrickert/discord-player-plus/releases",
      },
      {
        text: "Report bug",
        link: "https://github.com/larsrickert/discord-player-plus/issues/new/choose",
      },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          {
            text: "Getting Started",
            link: "/guide/getting-started",
          },
          {
            text: "Pre-build Slash Commands",
            link: "/guide/commands",
          },
          {
            text: "Player engines",
            link: "/guide/engines",
          },
          {
            text: "Example discord bot",
            link: "/guide/example-bot",
          },
        ],
      },
      {
        text: "API Reference",
        items: [
          {
            text: "Core API",
            link: "/api/core",
          },
          {
            text: "Slash Commands",
            link: "/api/commands",
          },
          {
            text: "Events",
            link: "/api/events",
          },
        ],
      },
    ],
  },
});
