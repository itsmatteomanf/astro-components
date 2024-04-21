# `@itsmatteomanf/astro-early-hints`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that provides a way to add link tags for all CSS and JS modules that Astro automatically adds in each page.

## Usage

### Prerequisites

The only prerequisite is using `astro@4.0.0` or higher.

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add @itsmatteomanf/astro-early-hints
```

```bash
npx astro add @itsmatteomanf/astro-early-hints
```

```bash
yarn astro add @itsmatteomanf/astro-early-hints
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add @itsmatteomanf/astro-early-hints
```

```bash
npm install @itsmatteomanf/astro-early-hints
```

```bash
yarn add @itsmatteomanf/astro-early-hints
```

2. Add the integration to your astro config

```diff
+import earlyHints from "@itsmatteomanf/astro-early-hints";

export default defineConfig({
  integrations: [
+    earlyHints(),
  ],
});
```

### Configuration

No configuration is necessary or exists.

## Licensing

[MIT Licensed](https://github.com/itsmatteomanf/astro-components/blob/main/LICENSE.md). Made with ❤️ by [Matteo Manfredi](https://github.com/itsmatteomanf).
