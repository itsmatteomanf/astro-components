import { z } from 'zod';

export const PagefindOptions = z.object({
	index: z.object({
		rootSelector: z.string().optional(),
		excludeSelectors: z.array(z.string()).optional(),
		forceLanguage: z.string().optional(),
		keepIndexUrl: z.boolean().optional(),
		verbose: z.boolean().optional(),
		logfile: z.string().optional(),
	}).optional().default({}),
	directories: z.array(z.string()).optional().default(['']),
	site: z.string().optional().default('pagefind'),
}).optional().default({});

export const validateOptions = (options: unknown) => PagefindOptions.parse(options);