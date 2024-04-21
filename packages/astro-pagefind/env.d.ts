/// <reference types="astro/client" />

type PagefindOptions =
	| {
			index?:
				| {
						rootSelector?: string | undefined;
						excludeSelectors?: string[] | undefined;
						forceLanguage?: string | undefined;
						keepIndexUrl?: boolean | undefined;
						verbose?: boolean | undefined;
						logfile?: string | undefined;
				  }
				| undefined;
			directories?: string[] | undefined;
			site?: string | undefined;
	  }
	| undefined;
