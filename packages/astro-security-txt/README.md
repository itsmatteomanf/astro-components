# `@itsmatteomanf/astro-security-txt`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to easily add a `security.txt` file to your Astro site.

## Usage

### Prerequisites

You need to be using `astro@4.0.0` or higher.

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add @itsmatteomanf/astro-security-txt
```

```bash
npx astro add @itsmatteomanf/astro-security-txt
```

```bash
yarn astro add @itsmatteomanf/astro-security-txt
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add @itsmatteomanf/astro-security-txt
```

```bash
npm install @itsmatteomanf/astro-security-txt
```

```bash
yarn add @itsmatteomanf/astro-security-txt
```

2. Add the integration to your astro config

```diff
+import securityTxt from "@itsmatteomanf/astro-security-txt";

export default defineConfig({
  integrations: [
+    securityTxt({
+      contact: 'mailto:example@example.com'
+    }),
  ],
});
```

### Configuration

The configuration opbject, with its defaults, is here:

```js
const options = {
  contact: undefined,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  encryption: undefined,
  acknowledgements: undefined,
  preferredLanguages: undefined,
  canonical: undefined,
  policy: undefined,
  hiring: undefined,
  csaf: undefined,
};
```

The only required option is `contact`, which must be a string or an array of strings.

All other options are optional, or a string or an array of strings.

It follows the specs at [securitytxt.org](https://securitytxt.org).

## Licensing

[MIT Licensed](https://github.com/itsmatteomanf/astro-components/blob/main/LICENSE). Made with ❤️ by [Matteo Manfredi](https://github.com/itsmatteomanf).
