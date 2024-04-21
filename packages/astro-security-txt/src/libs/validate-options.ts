import { z } from 'zod';

export const SecurityTxtOptions = z.object({
	contact: z.union([z.string(), z.array(z.string())]),
	expires: z.date().optional().default(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)),
	encryption: z.union([z.string(), z.array(z.string())]).optional(),
	acknowledgements: z.union([z.string(), z.array(z.string())]).optional(),
	preferredLanguages: z.union([z.string(), z.array(z.string())]).optional(),
	canonical: z.union([z.string(), z.array(z.string()), z.boolean()]).optional(),
	policy: z.union([z.string(), z.array(z.string())]).optional(),
	hiring: z.union([z.string(), z.array(z.string())]).optional(),
	csaf: z.union([z.string(), z.array(z.string())]).optional(),
});

export const validateOptions = (options: unknown) => SecurityTxtOptions.parse(options)