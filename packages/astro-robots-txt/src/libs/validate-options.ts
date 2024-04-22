import { z } from "zod";

const defaultPolicy: RobotsTxtOptions & any = {
	sitemap: true,
	policy: [
		{
			allow: '/',
			userAgent: '*',
		},
	],
	sitemapBaseFileName: 'sitemap-index',
};
const schemaSitemapItem = z
	.string()
	.min(1);
const schemaCleanParam = z.string().max(500);
const schemaPath = z.string().or(z.string().array()).optional();

export const ZodTypes = z
	.object({
		host: z
			.string()
			.or(z.boolean())
			.optional(),
		sitemap: schemaSitemapItem.or(schemaSitemapItem.array()).or(z.boolean()).optional().default(defaultPolicy.sitemap),
		policy: z
			.object({
				userAgent: schemaPath.default('*'),
				allow: schemaPath,
				disallow: schemaPath,
				cleanParam: schemaCleanParam.or(schemaCleanParam.array()).optional(),
				crawlDelay: z
					.number()
					.nonnegative()
					.optional()
					.refine((val) => typeof val === 'undefined' || Number.isFinite(val), { message: 'Must be finite number' }),
			})
			.array()
			.nonempty()
			.optional()
			.default(defaultPolicy.policy),
		sitemapBaseFileName: z
			.string()
			.min(1)
			.optional()
			.default(defaultPolicy.sitemapBaseFileName),
		transform: z.function().args(z.string()).returns(z.any()).optional(),
	})
	.default(defaultPolicy);

export const validateOptions = (options: unknown) =>
	ZodTypes.parse(options);
