import type { AstroIntegration } from "astro";
import { createIndex } from "pagefind";
import { ZodError, z } from "zod";
import { name } from "../package.json";
import {
	PagefindOptions as ZodTypes,
	validateOptions,
} from "./libs/validate-options";

export const integration = (
	options: PagefindOptions | undefined,
): AstroIntegration => {
	let generate = true;
	let validatedOptions: z.infer<typeof ZodTypes>;

	return {
		name,
		hooks: {
			"astro:config:done": async ({ logger }) => {
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
			},

			"astro:build:done": async ({ dir, logger }) => {
				if (!generate) {
					return;
				}

				try {
					const { index } = await createIndex(validatedOptions.index);
					logger.info(`Created Pagefind index.`);

					validatedOptions.directories.map(async (directory) => {
						await index?.addDirectory({
							path: new URL(directory, dir).pathname,
						});
						logger.info(`Added ${directory} to the index.`);
					});

					await index?.writeFiles({
						outputPath: new URL(validatedOptions.site, dir).pathname,
					});
					logger.info(`Wrote Pagefind files to ${validatedOptions.site}.`);
				} catch (error) {
					logger.error(
						`Error building Pagefind index. Search will not be available.`,
					);
				}
			},
		},
	};
};

export default integration;
