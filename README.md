# Matteo's Astro Components

A collection of Astro integrations developed by me:

- [Early hints](./packages/astro-early-hints/README.md): preload links for stylesheets and modules.
- [Pagefind](./packages/astro-pagefind/README.md): build a search index.
- [robots.txt](./packages/astro-robots-txt/README.md): configure crawler policies.
- [security.txt](./packages/astro-security-txt/README.md): publish security contact information.

## Development

Use the Node.js version in `.nvmrc` and pnpm 12.18.0 (also pinned in `packageManager`).

```sh
nvm install
nvm use
npm install --global pnpm@12.18.0
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
pnpm test
pnpm run test:consumer
pnpm run format:check
```

`test:consumer` packs all four packages, installs them into a temporary Astro application, checks their public types, builds the site, and verifies the generated files. Set `ASTRO_VERSION` to test another supported version. CI tests Astro 4, 5, 6, and 7.

TypeScript stays on 6.0.3 because tsup's declaration generation and the import-formatting plugins require its JavaScript compiler API; TypeScript 7 is not yet compatible with this toolchain. The root `engines` setting applies to repository development; the published integrations retain their existing Astro peer ranges.

Use `pnpm changeset` for package changes. The release workflow prepares version PRs and publishes from `main`.

## Licensing

[MIT Licensed](./LICENSE.md). Made with ❤️ by [Matteo Manfredi](https://github.com/itsmatteomanf).
