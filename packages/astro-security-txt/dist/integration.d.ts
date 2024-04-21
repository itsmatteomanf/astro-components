import { AstroIntegration } from 'astro';
import { SecurityTxtOptions } from './libs/validate-options.js';
import { z } from 'zod';

type Options = z.infer<typeof SecurityTxtOptions>;
declare const integration: (options: Options) => AstroIntegration;

export { integration as default, integration };
