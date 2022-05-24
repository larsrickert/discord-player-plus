import { defineConfig } from "vitepress";
import pkg from "../../package.json";

export default defineConfig({
  lang: "en-US",
  title: "Discord Player Plus",
  description: pkg.description,
  lastUpdated: true,

  themeConfig: {
    repo: pkg.repository.url,
    docsBranch: "main",
    editLinks: true,
    editLinkText: "Edit this page on GitHub",
    lastUpdated: "Last Updated",

    sidebar: [
      {
        text: "Introduction",
        children: [
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
    ],
  },
});
