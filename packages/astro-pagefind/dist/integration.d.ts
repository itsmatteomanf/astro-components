import { AstroIntegration } from 'astro';
import { PagefindOptions } from './libs/validate-options.js';
import { z } from 'zod';

type Options = z.infer<typeof PagefindOptions>;
declare const integration: (options: Options) => AstroIntegration;

export { integration as default, integration };
