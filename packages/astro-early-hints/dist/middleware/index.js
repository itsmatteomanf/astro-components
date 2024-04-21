import { defineMiddleware as n } from "astro/middleware";
import { parse as a } from "node-html-parser";
var d = n(async (i, o) => {
  let r = await o(),
    e = a(await r.text()),
    l = e.querySelector("head");
  return (
    e.querySelectorAll('link[rel="stylesheet"]').map((t) => {
      l.insertAdjacentHTML(
        "afterbegin",
        `<link rel="preload" as="style" href="${t.getAttribute("href")}">`,
      );
    }),
    e.querySelectorAll('script[type="module"]').map((t) => {
      l.insertAdjacentHTML(
        "afterbegin",
        `<link rel="modulepreload" href="${t.getAttribute("src")}">`,
      );
    }),
    new Response(e.toString(), r)
  );
});
export { d as onRequest };
//# sourceMappingURL=index.js.map
