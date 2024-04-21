import type { AstroConfig, AstroIntegration } from "astro";
import { mkdirSync, writeFileSync } from "node:fs";
import { ZodError, z } from "zod";
import { name } from "../package.json";
import { SecurityTxtOptions as ZodTypes, validateOptions } from "./libs/validate-options";

export const integration = (options: SecurityTxtOptions): AstroIntegration => {
	let config: AstroConfig;
	let generate = true;
	let validatedOptions: z.infer<typeof ZodTypes>;

	return {
		name,
		hooks: {
			"astro:config:done": async ({ config: cfg, logger }) => {
				try {
					validatedOptions = validateOptions(options);
				} catch (error) {
					if (error instanceof ZodError) {
						generate = false;
						logger.error(
							`Invalid options for \`security-txt\`. \`security.txt\` will not be generated.`,
						);
					} else {
						throw error;
					}
				}
				config = cfg;
			},

			"astro:build:done": async ({ dir, logger }) => {
				if (!generate) {
					return;
				}

				let securityTxtContent = "";

				securityTxtContent += `Expires: ${validatedOptions.expires.toISOString()}\n`;

				if (
					validatedOptions.canonical instanceof Boolean ||
					validatedOptions.canonical === undefined
				) {
					if (
						validatedOptions.canonical ||
						validatedOptions.canonical === undefined
					) {
						if (!config.site) {
							logger.warn(
								"No `site` provided. `security.txt` has no canonical.",
							);
						} else {
							securityTxtContent += `Canonical: ${config.site}.well-known/security.txt\n\n`;
						}
					}
				} else if (validatedOptions.canonical instanceof Array) {
					validatedOptions.canonical.map((canonical) => {
						securityTxtContent += `Canonical: ${canonical}\n`;
					});
					securityTxtContent += `\n`;
				}

				if (validatedOptions.preferredLanguages) {
					if (validatedOptions.preferredLanguages instanceof Array) {
						securityTxtContent += `Preferred-Languages: ${validatedOptions.preferredLanguages.join(", ")}\n`;
					} else {
						securityTxtContent += `Preferred-Languages: ${validatedOptions.preferredLanguages}\n`;
					}
				}

				if (validatedOptions.contact instanceof Array) {
					validatedOptions.contact.map((contact) => {
						securityTxtContent += `Contact: ${contact}\n`;
					});
				} else {
					securityTxtContent += `Contact: ${validatedOptions.contact}\n`;
				}

				securityTxtContent += "\n";

				if (validatedOptions.encryption) {
					if (validatedOptions.encryption instanceof Array) {
						validatedOptions.encryption.map((encryption) => {
							securityTxtContent += `Encryption: ${encryption}\n`;
						});
					} else {
						securityTxtContent += `Encryption: ${validatedOptions.encryption}\n`;
					}
				}

				if (validatedOptions.acknowledgements) {
					if (validatedOptions.acknowledgements instanceof Array) {
						validatedOptions.acknowledgements.map((acknowledgements) => {
							securityTxtContent += `Acknowledgements: ${acknowledgements}\n`;
						});
					} else {
						securityTxtContent += `Acknowledgements: ${validatedOptions.acknowledgements}\n`;
					}
				}

				if (validatedOptions.policy) {
					if (validatedOptions.policy instanceof Array) {
						validatedOptions.policy.map((policy) => {
							securityTxtContent += `Policy: ${policy}\n`;
						});
					} else {
						securityTxtContent += `Policy: ${validatedOptions.policy}\n`;
					}
				}

				if (validatedOptions.hiring) {
					if (validatedOptions.hiring instanceof Array) {
						validatedOptions.hiring.map((hiring) => {
							securityTxtContent += `Hiring: ${hiring}\n`;
						});
					} else {
						securityTxtContent += `Hiring: ${validatedOptions.hiring}\n`;
					}
				}

				if (validatedOptions.csaf) {
					if (validatedOptions.csaf instanceof Array) {
						validatedOptions.csaf.map((csaf) => {
							securityTxtContent += `CSAF: ${csaf}\n`;
						});
					} else {
						securityTxtContent += `CSAF: ${validatedOptions.csaf}\n`;
					}
				}

				mkdirSync(new URL(".well-known", dir), { recursive: true });
				writeFileSync(
					new URL(".well-known/security.txt", dir),
					securityTxtContent,
				);

				logger.info("`security.txt` is created.");
			},
		},
	};
};

export default integration;
