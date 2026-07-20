import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { createIndex } from "pagefind";
import { z, ZodError } from "zod";
import { name } from "../package.json";
import {
	validateOptions,
	PagefindOptions as ZodTypes,
} from "./libs/validate-options";

export const integration = (options?: PagefindOptions): AstroIntegration => {
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
							`Invalid options for \`astro-pagefind\`. A Pagefind index will not be generated.`,
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
					if (!index) {
						throw new Error("Pagefind did not return an index instance.");
					}
					logger.info(`Created Pagefind index.`);

					for (const directory of validatedOptions.directories) {
						await index.addDirectory({
							path: fileURLToPath(new URL(directory, dir)),
						});
						logger.info(`Added \`/${directory}\` to the index.`);
					}

					await index.writeFiles({
						outputPath: fileURLToPath(new URL(validatedOptions.site, dir)),
					});
					logger.info(`Wrote Pagefind files to \`/${validatedOptions.site}\`.`);
				} catch (error) {
					logger.error(
						`Error building Pagefind index. Search will not be available.\n${
							error instanceof Error
								? (error.stack ?? error.message)
								: String(error)
						}`,
					);
				}
			},
		},
	};
};

export default integration;
