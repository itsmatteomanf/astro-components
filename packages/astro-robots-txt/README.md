# `@itsmatteomanf/astro-robots-txt`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to easily add a `robots.txt` file to your Astro site.

## Usage

### Prerequisites

You need to be using `astro@4.0.0` or higher.

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add @itsmatteomanf/astro-robots-txt
```

```bash
npx astro add @itsmatteomanf/astro-robots-txt
```

```bash
yarn astro add @itsmatteomanf/astro-robots-txt
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add @itsmatteomanf/astro-robots-txt
```

```bash
npm install @itsmatteomanf/astro-robots-txt
```

```bash
yarn add @itsmatteomanf/astro-robots-txt
```

2. Add the integration to your astro config

```diff
+import robotsTxt from "@itsmatteomanf/astro-robots-txt";

export default defineConfig({
  integrations: [
+    robotsTxt(),
  ],
});
```

### Configuration

TODO

## Licensing

[MIT Licensed](https://github.com/itsmatteomanf/astro-components/blob/main/LICENSE.md). Made with ❤️ by [Matteo Manfredi](https://github.com/itsmatteomanf).
