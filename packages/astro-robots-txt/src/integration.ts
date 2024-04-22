import type { AstroConfig, AstroIntegration } from "astro";
import { writeFileSync } from "node:fs";
import { ZodError, z } from "zod";
import { name } from "../package.json";
import {
	ZodTypes,
	validateOptions,
} from "./libs/validate-options";

export const integration = (options: RobotsTxtOptions): AstroIntegration => {
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
					if (validatedOptions.sitemap instanceof Boolean) {
						robotsTxtContent += `Sitemap: ${new URL(`${validatedOptions.sitemapBaseFileName}.xml`, config.site)}\n`;
					} else if (validatedOptions.sitemap instanceof Array) {
						validatedOptions.sitemap.map((sitemap) => {
							robotsTxtContent += `Sitemap: ${sitemap}\n`;
						});
					} else {
						robotsTxtContent += `Sitemap: ${validatedOptions.sitemap}\n`;
					}
				}

				robotsTxtContent += "\n";

				validatedOptions.policy.map((policy) => {
					robotsTxtContent += `User-agent: ${policy.userAgent}\n`;

					if (policy.allow) {
						if (policy.allow instanceof Array) {
							policy.allow.map((allow) => {
								robotsTxtContent += `Allow: ${allow}\n`;
							});
						} else {
							robotsTxtContent += `Allow: ${policy.allow}\n`;
						}
					}

					if (policy.disallow) {
						if (policy.disallow instanceof Array) {
							policy.disallow.map((disallow) => {
								robotsTxtContent += `Disallow: ${disallow}\n`;
							});
						} else {
							robotsTxtContent += `Disallow: ${policy.disallow}\n`;
						}
					}

					if (policy.cleanParam) {
						if (policy.cleanParam instanceof Array) {
							policy.cleanParam.map((cleanParam) => {
								robotsTxtContent += `Clean-param: ${cleanParam}\n`;
							});
						} else {
							robotsTxtContent += `Clean-param: ${policy.cleanParam}\n`;
						}
					}

					if (policy.crawlDelay) {
						robotsTxtContent += `Crawl-delay: ${policy.crawlDelay}\n`;
					}

					robotsTxtContent += "\n";
				});

				if (validatedOptions.host) {
					robotsTxtContent += `Host: ${validatedOptions.host}\n`;
				}

				writeFileSync(
					new URL("robots.txt", dir),
					robotsTxtContent,
				);

				logger.info("`robots.txt` created.");
			},
		},
	};
};

export default integration;
