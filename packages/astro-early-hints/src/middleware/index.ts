import { defineMiddleware } from "astro/middleware";
import { parse } from "node-html-parser";

export const onRequest = defineMiddleware(async (_, next) => {
  const html = await next();

  const root = parse(await html.text());
  const head = root.querySelector("head")!;

  root.querySelectorAll('link[rel="stylesheet"]').map((style) => {
    head.insertAdjacentHTML(
      "afterbegin",
      `<link rel="preload" as="style" href="${style.getAttribute("href")}">`,
    );
  });

  root.querySelectorAll('script[type="module"]').map((script) => {
    head.insertAdjacentHTML(
      "afterbegin",
      `<link rel="modulepreload" href="${script.getAttribute("src")}">`,
    );
  });

  return new Response(root.toString(), html);
});
