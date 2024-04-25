/// <reference types="astro/client" />

type RobotsTxtOptions =
	| {
			host?: string | boolean;
			sitemap?: string | string[] | boolean;
			policy?: PolicyItem[];
			sitemapBaseFileName?: string;
			transform?(content: string): string | Promise<string>;
	  }
	| undefined;
