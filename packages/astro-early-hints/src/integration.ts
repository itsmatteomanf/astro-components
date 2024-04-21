import type { AstroIntegration } from "astro";
import { name } from "../package.json";

export const integration = () => {
	const integration: AstroIntegration = {
		name,
		hooks: {
			"astro:config:setup": ({ addMiddleware }) => {
				addMiddleware({
					entrypoint: "@itsmatteomanf/astro-early-hints/middleware",
					order: "post",
				});
			},
		},
	};

	return integration;
};

export default integration;
