import { z } from 'zod';

declare const SecurityTxtOptions: z.ZodObject<{
    contact: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    expires: z.ZodDefault<z.ZodOptional<z.ZodDate>>;
    encryption: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    acknowledgements: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    preferredLanguages: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    canonical: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">, z.ZodBoolean]>>;
    policy: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    hiring: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    csaf: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
}, "strip", z.ZodTypeAny, {
    contact: (string | string[]) & (string | string[] | undefined);
    expires: Date;
    encryption?: string | string[] | undefined;
    acknowledgements?: string | string[] | undefined;
    preferredLanguages?: string | string[] | undefined;
    canonical?: string | boolean | string[] | undefined;
    policy?: string | string[] | undefined;
    hiring?: string | string[] | undefined;
    csaf?: string | string[] | undefined;
}, {
    contact: (string | string[]) & (string | string[] | undefined);
    expires?: Date | undefined;
    encryption?: string | string[] | undefined;
    acknowledgements?: string | string[] | undefined;
    preferredLanguages?: string | string[] | undefined;
    canonical?: string | boolean | string[] | undefined;
    policy?: string | string[] | undefined;
    hiring?: string | string[] | undefined;
    csaf?: string | string[] | undefined;
}>;
declare const validateOptions: (options: unknown) => {
    contact: (string | string[]) & (string | string[] | undefined);
    expires: Date;
    encryption?: string | string[] | undefined;
    acknowledgements?: string | string[] | undefined;
    preferredLanguages?: string | string[] | undefined;
    canonical?: string | boolean | string[] | undefined;
    policy?: string | string[] | undefined;
    hiring?: string | string[] | undefined;
    csaf?: string | string[] | undefined;
};

export { SecurityTxtOptions, validateOptions };
