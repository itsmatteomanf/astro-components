var t = () => ({
  name: "early-hints",
  hooks: {
    "astro:config:setup": ({ addMiddleware: o }) => {
      o({ entrypoint: "@integrations/early-hints/middleware", order: "post" });
    },
  },
});
var i = t;
export { i as default };
//# sourceMappingURL=index.js.map
