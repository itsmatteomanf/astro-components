import type { AstroConfig, AstroIntegration } from "astro";
import { writeFileSync } from "node:fs";
import { ZodError, boolean, z } from "zod";
import { name } from "../package.json";
import { ZodTypes, validateOptions } from "./libs/validate-options";

export const integration = (options?: RobotsTxtOptions): AstroIntegration => {
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
							`Invalid options. \`robots.txt\` will not be generated.`,
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

				let robotsTxtContent = "";

				if (validatedOptions.sitemap) {
					if (typeof validatedOptions.sitemap === "boolean") {
						if (!config.site) {
							logger.warn("No `site` provided. `robots.txt` has no sitemap.");
						} else {
							robotsTxtContent += `sitemap: ${new URL(`${validatedOptions.sitemapBaseFileName}.xml`, config.site)}\n`;
						}
					} else if (validatedOptions.sitemap instanceof Array) {
						validatedOptions.sitemap.map((sitemap) => {
							robotsTxtContent += `sitemap: ${sitemap}\n`;
						});
					} else {
						robotsTxtContent += `sitemap: ${validatedOptions.sitemap}\n`;
					}
				}

				robotsTxtContent += "\n";

				validatedOptions.policy.map((policy) => {
					robotsTxtContent += `user-agent: ${policy.userAgent}\n`;

					if (policy.allow) {
						if (policy.allow instanceof Array) {
							policy.allow.map((allow) => {
								robotsTxtContent += `allow: ${allow}\n`;
							});
						} else {
							robotsTxtContent += `allow: ${policy.allow}\n`;
						}
					}

					if (policy.disallow) {
						if (policy.disallow instanceof Array) {
							policy.disallow.map((disallow) => {
								robotsTxtContent += `disallow: ${disallow}\n`;
							});
						} else {
							robotsTxtContent += `disallow: ${policy.disallow}\n`;
						}
					}

					if (policy.cleanParam) {
						if (policy.cleanParam instanceof Array) {
							policy.cleanParam.map((cleanParam) => {
								robotsTxtContent += `clean-param: ${cleanParam}\n`;
							});
						} else {
							robotsTxtContent += `clean-param: ${policy.cleanParam}\n`;
						}
					}

					if (policy.crawlDelay) {
						robotsTxtContent += `crawl-delay: ${policy.crawlDelay}\n`;
					}
				});

				if (validatedOptions.host) {
					robotsTxtContent += `host: ${validatedOptions.host}\n`;
				}

				writeFileSync(new URL("robots.txt", dir), robotsTxtContent);

				logger.info("`robots.txt` created.");
			},
		},
	};
};

export default integration;
