import { z } from 'zod';

declare const PagefindOptions: z.ZodDefault<z.ZodOptional<z.ZodObject<{
    index: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        rootSelector: z.ZodOptional<z.ZodString>;
        excludeSelectors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        forceLanguage: z.ZodOptional<z.ZodString>;
        keepIndexUrl: z.ZodOptional<z.ZodBoolean>;
        verbose: z.ZodOptional<z.ZodBoolean>;
        logfile: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        rootSelector?: string | undefined;
        excludeSelectors?: string[] | undefined;
        forceLanguage?: string | undefined;
        keepIndexUrl?: boolean | undefined;
        verbose?: boolean | undefined;
        logfile?: string | undefined;
    }, {
        rootSelector?: string | undefined;
        excludeSelectors?: string[] | undefined;
        forceLanguage?: string | undefined;
        keepIndexUrl?: boolean | undefined;
        verbose?: boolean | undefined;
        logfile?: string | undefined;
    }>>>;
    directories: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    site: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    index: {
        rootSelector?: string | undefined;
        excludeSelectors?: string[] | undefined;
        forceLanguage?: string | undefined;
        keepIndexUrl?: boolean | undefined;
        verbose?: boolean | undefined;
        logfile?: string | undefined;
    };
    directories: string[];
    site: string;
}, {
    index?: {
        rootSelector?: string | undefined;
        excludeSelectors?: string[] | undefined;
        forceLanguage?: string | undefined;
        keepIndexUrl?: boolean | undefined;
        verbose?: boolean | undefined;
        logfile?: string | undefined;
    } | undefined;
    directories?: string[] | undefined;
    site?: string | undefined;
}>>>;
declare const validateOptions: (options: unknown) => {
    index: {
        rootSelector?: string | undefined;
        excludeSelectors?: string[] | undefined;
        forceLanguage?: string | undefined;
        keepIndexUrl?: boolean | undefined;
        verbose?: boolean | undefined;
        logfile?: string | undefined;
    };
    directories: string[];
    site: string;
};

export { PagefindOptions, validateOptions };
