# Lars Rickerts' Node.js Express Template with TypeScript

This is a template app for a Node.js application / API using [express](https://expressjs.com/de/) and [TypeScript](https://www.typescriptlang.org/).

## Project setup

```
npm install
```

### Run with hot-reload for development

```
npm run dev
```

### Start for production

```
npm start
```

### Lints and fixes files

```
npm run lint
```

<br />

# Folder structure inside src

| Folder / File | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| controllers   | App functionality, used by routes                                      |
| middleware    | Express middleware for intercepting requests                           |
| routes        | Handlers for all API routes                                            |
| types         | Global TypeScript types, interfaces, classes etc                       |
| utils         | Common helper functions/utilities                                      |
| app.ts        | Main app entry file. Creates app and registers middleware, routes etc. |
| config.ts     | Static configuration/environments                                      |

<br />

# Semantic release

This repository uses [semantic release](https://semantic-release.gitbook.io/semantic-release/) for automatically managing changelogs, package versions and GitHub releases. You will find more information in the [pull request template](.github/pull_request_template.md).

If you don't want to use semantic release you can remove the files

- `.github/workflows/release.yml`
- `.github/pull_request_template.md`
- `CHANGELOG.md`

Also you need to run

```
npm uninstall @semantic-release/changelog @semantic-release/git
```

and remove the `release` option in the `package.json`.

<br />

# Code Guidelines

It is recommend to follow the below guidelines which contain best practices.

## File naming convention

- Controllers: `*.controllers.ts`
- Middleware: `*.middleware.ts`
- Routes: `*.routes.ts`
