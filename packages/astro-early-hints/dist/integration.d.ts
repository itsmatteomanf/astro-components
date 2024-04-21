import { AstroIntegration } from "astro";

declare const integration: () => AstroIntegration;

export { integration as default, integration };
