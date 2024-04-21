var o = () => ({
    name: "early-hints",
    hooks: {
      "astro:config:setup": ({ addMiddleware: t }) => {
        t({
          entrypoint: "@integrations/early-hints/middleware",
          order: "post",
        });
      },
    },
  }),
  n = o;
export { n as default, o as integration };
//# sourceMappingURL=integration.js.map
