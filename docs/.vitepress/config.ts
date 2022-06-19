import { defineConfig } from "vitepress";
import pkg from "../../package.json";

export default defineConfig({
  lang: "en-US",
  title: "Discord Player Plus",
  description: pkg.description,
  lastUpdated: true,

  themeConfig: {
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

    sidebar: [
      {
        text: "Introduction",
        items: [
          {
            text: "What is discord-player-plus?",
            link: "/",
          },
          {
            text: "Getting Started",
            link: "/guide/getting-started",
          },
          {
            text: "Pre-build commands",
            link: "/guide/pre-build-commands",
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
        ],
      },
    ],
  },
});
