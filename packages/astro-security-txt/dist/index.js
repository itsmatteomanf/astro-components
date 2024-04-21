import{mkdirSync as y,writeFileSync as u}from"node:fs";import{z as e}from"zod";var g=e.object({contact:e.union([e.string(),e.array(e.string())]),expires:e.date().optional().default(()=>new Date(Date.now()+1e3*60*60*24*365)),encryption:e.union([e.string(),e.array(e.string())]).optional(),acknowledgements:e.union([e.string(),e.array(e.string())]).optional(),preferredLanguages:e.union([e.string(),e.array(e.string())]).optional(),canonical:e.union([e.string(),e.array(e.string()),e.boolean()]).optional(),policy:e.union([e.string(),e.array(e.string())]).optional(),hiring:e.union([e.string(),e.array(e.string())]).optional(),csaf:e.union([e.string(),e.array(e.string())]).optional()}),l=a=>g.parse(a);import{ZodError as d}from"zod";var f=a=>{let p="security-txt",s,c=!0,n;return{name:p,hooks:{"astro:config:done":async({config:r,logger:o})=>{try{n=l(a)}catch(t){if(t instanceof d)c=!1,o.error("Invalid options for `security-txt`. `security.txt` will not be generated.");else throw t}s=r},"astro:build:done":async({dir:r,logger:o})=>{if(!c)return;let t="";t+=`Expires: ${n.expires.toISOString()}
`,n.canonical instanceof Boolean||n.canonical===void 0?(n.canonical||n.canonical===void 0)&&(s.site?t+=`Canonical: ${s.site}.well-known/security.txt

`:o.warn("No `site` provided. `security.txt` has no canonical.")):n.canonical instanceof Array&&(n.canonical.map(i=>{t+=`Canonical: ${i}
`}),t+=`
`),n.preferredLanguages&&(n.preferredLanguages instanceof Array?t+=`Preferred-Languages: ${n.preferredLanguages.join(", ")}
`:t+=`Preferred-Languages: ${n.preferredLanguages}
`),n.contact instanceof Array?n.contact.map(i=>{t+=`Contact: ${i}
`}):t+=`Contact: ${n.contact}
`,t+=`
`,n.encryption&&(n.encryption instanceof Array?n.encryption.map(i=>{t+=`Encryption: ${i}
`}):t+=`Encryption: ${n.encryption}
`),n.acknowledgements&&(n.acknowledgements instanceof Array?n.acknowledgements.map(i=>{t+=`Acknowledgements: ${i}
`}):t+=`Acknowledgements: ${n.acknowledgements}
`),n.policy&&(n.policy instanceof Array?n.policy.map(i=>{t+=`Policy: ${i}
`}):t+=`Policy: ${n.policy}
`),n.hiring&&(n.hiring instanceof Array?n.hiring.map(i=>{t+=`Hiring: ${i}
`}):t+=`Hiring: ${n.hiring}
`),n.csaf&&(n.csaf instanceof Array?n.csaf.map(i=>{t+=`CSAF: ${i}
`}):t+=`CSAF: ${n.csaf}
`),y(new URL(".well-known",r),{recursive:!0}),u(new URL(".well-known/security.txt",r),t),o.info("`security.txt` is created.")}}}};var L=f;export{L as default};
//# sourceMappingURL=index.js.map