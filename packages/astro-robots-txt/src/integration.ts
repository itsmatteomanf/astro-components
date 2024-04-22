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

				if (validatedOptions.host) {
					robotsTxtContent += `Host: ${validatedOptions.host}\n`;
				}

				writeFileSync(
					new URL("robots.txt", dir),
					robotsTxtContent,
				);

				logger.info("`robots.txt` is created.");
			},
		},
	};
};

export default integration;
