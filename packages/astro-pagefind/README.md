# `@itsmatteomanf/astro-pagefind`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that runs the indexing operation for Pagefind directly during Astro's build.

## Usage

### Prerequisites

You need to be using `astro@4.0.0` or higher, and `pagefind@1.0.0` or higher must be installed and in use, as this package just runs the indexing.

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add @itsmatteomanf/astro-pagefind
```

```bash
npx astro add @itsmatteomanf/astro-pagefind
```

```bash
yarn astro add @itsmatteomanf/astro-pagefind
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add @itsmatteomanf/astro-pagefind
```

```bash
npm install @itsmatteomanf/astro-pagefind
```

```bash
yarn add @itsmatteomanf/astro-pagefind
```

2. Add the integration to your astro config

```diff
+import pagefind from "@itsmatteomanf/astro-pagefind";

export default defineConfig({
  integrations: [
+    pagefind(),
  ],
});
```

### Configuration

No configuration is necessary for the integration to work.

The configuration object allows configuring some aspects of Pagefind.

```js
const options = {
  index: {
    rootSelector: undefined,
    excludeSelectors: undefined,
    forceLanguage: undefined,
    keepIndexUrl: undefined,
    verbose: undefined,
    logfile: undefined,
  },
  directories: [""],
  site: "pagefind",
};
```

All the settings align with Pagefind's CLI, at [https://pagefind.app/docs/config-options/](https://pagefind.app/docs/config-options/). If the optipon is not listed here, it's not suppoerted by this integration.

Directories are relative to the output directory of your Astro project, so `""` will match the root of the output folder.

## Licensing

[MIT Licensed](https://github.com/itsmatteomanf/astro-components/blob/main/LICENSE). Made with ❤️ by [Matteo Manfredi](https://github.com/itsmatteomanf).
