import { defineMiddleware } from "astro/middleware";
import { parse } from "node-html-parser";

export const onRequest = defineMiddleware(async (_, next) => {
	const response = await next();

	if (
		!response.body ||
		!response.headers.get("content-type")?.includes("text/html")
	) {
		return response;
	}
	const html = await response.text();
	const root = parse(html);
	const head = root.querySelector("head");
	if (!head) {
		return new Response(html, response);
	}
	const escapeAttribute = (value: string) =>
		value
			.replaceAll("&", "&amp;")
			.replaceAll('"', "&quot;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;");

	root
		.querySelectorAll('link[rel="stylesheet"]')
		.filter((style) => style.hasAttribute("href") && style.getAttribute("href"))
		.map((style) => {
			head.insertAdjacentHTML(
				"beforeend",
				`<link rel="preload" as="style" href="${escapeAttribute(style.getAttribute("href")!)}">`,
			);
		});

	root
		.querySelectorAll('script[type="module"]')
		.filter(
			(script) => script.hasAttribute("src") && script.getAttribute("src"),
		)
		.map((script) => {
			head.insertAdjacentHTML(
				"beforeend",
				`<link rel="modulepreload" href="${escapeAttribute(script.getAttribute("src")!)}">`,
			);
		});

	const headers = new Headers(response.headers);
	headers.delete("content-length");
	return new Response(root.toString(), {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
