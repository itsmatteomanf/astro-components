import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), "astro-components-consumer-"));
const fixture = join(temporary, "fixture");
const bundles = join(temporary, "bundles");
const astro = process.env.ASTRO_VERSION ?? "7.4.11";
const run = (args, cwd) =>
	execFileSync("pnpm", args, { cwd, stdio: "inherit" });
try {
	mkdirSync(bundles);
	mkdirSync(join(fixture, "src/pages"), { recursive: true });
	const dependencies = {
		astro,
		"pagefind": "1.6.0",
		"typescript": "6.0.3",
		"@types/node": "26.6.6",
	};
	for (const name of [
		"astro-early-hints",
		"astro-pagefind",
		"astro-robots-txt",
		"astro-security-txt",
	]) {
		run(["pack", "--pack-destination", bundles], join(root, "packages", name));
		const archive = readdirSync(bundles).find((file) =>
			file.includes(`${name}-`),
		);
		assert.ok(archive, `Missing archive for ${name}`);
		dependencies[`@itsmatteomanf/${name}`] = `file:${join(bundles, archive)}`;
	}
	writeFileSync(
		join(fixture, "package.json"),
		JSON.stringify({ private: true, type: "module", dependencies }),
	);
	writeFileSync(
		join(fixture, "pnpm-workspace.yaml"),
		"allowBuilds:\n  esbuild: true\n  sharp: true\n",
	);
	writeFileSync(
		join(fixture, "astro.config.mjs"),
		`
    import { defineConfig } from "astro/config";
    import earlyHints from "@itsmatteomanf/astro-early-hints";
    import pagefind from "@itsmatteomanf/astro-pagefind";
    import robotsTxt from "@itsmatteomanf/astro-robots-txt";
    import securityTxt from "@itsmatteomanf/astro-security-txt";
    export default defineConfig({
      site: "https://example.com",
      integrations: [earlyHints(), pagefind(), robotsTxt(), securityTxt({ contact: "mailto:security@example.com" })],
    });
  `,
	);
	writeFileSync(
		join(fixture, "src/pages/index.astro"),
		`
    <html lang="en"><head><title>Compatibility fixture</title>
    <link rel="stylesheet" href="/fixture.css" />
    <script is:inline type="module" src="/fixture.js"></script>
    </head><body><main data-pagefind-body>Searchable compatibility content</main></body></html>
  `,
	);
	writeFileSync(
		join(fixture, "tsconfig.json"),
		JSON.stringify({
			compilerOptions: {
				strict: true,
				skipLibCheck: true,
				module: "esnext",
				moduleResolution: "bundler",
				target: "es2022",
				noEmit: true,
			},
			include: ["consumer.ts"],
		}),
	);
	writeFileSync(
		join(fixture, "consumer.ts"),
		`
    import earlyHints from "@itsmatteomanf/astro-early-hints";
    import pagefind, { type PagefindOptions } from "@itsmatteomanf/astro-pagefind";
    import robotsTxt, { type RobotsTxtOptions } from "@itsmatteomanf/astro-robots-txt";
    import securityTxt, { type SecurityTxtOptions } from "@itsmatteomanf/astro-security-txt";
    const pagefindOptions: PagefindOptions = {};
    const robotsOptions: RobotsTxtOptions = { policy: [{ userAgent: ["BotA", "BotB"], crawlDelay: 0 }], transform: async text => text };
    const securityOptions: SecurityTxtOptions = { contact: "mailto:security@example.com", canonical: false };
    earlyHints(); pagefind(pagefindOptions); robotsTxt(robotsOptions); securityTxt(securityOptions);
    // @ts-expect-error directories must be an array, and options must not degrade to any
    pagefind({ directories: 1 });
    // @ts-expect-error crawlDelay must be numeric
    robotsTxt({ policy: [{ crawlDelay: "slow" }] });
    // @ts-expect-error contact is required
    securityTxt({ canonical: false });
  `,
	);
	run(["install", "--no-frozen-lockfile"], fixture);
	// Check consumer calls, including negative cases, without checking optional Astro adapter types.
	run(["exec", "tsc", "--noEmit"], fixture);
	run(["exec", "astro", "build"], fixture);
	const read = (path) => readFileSync(join(fixture, "dist", path), "utf8");
	assert.match(read("robots.txt"), /user-agent: \*\nallow: \//);
	assert.match(read("robots.txt"), /https:\/\/example.com\/sitemap-index.xml/);
	assert.match(
		read(".well-known/security.txt"),
		/Contact: mailto:security@example.com/,
	);
	assert.match(
		read("index.html"),
		/rel="preload" as="style" href="\/fixture.css"/,
	);
	assert.match(read("index.html"), /rel="modulepreload" href="\/fixture.js"/);
	assert.ok(read("pagefind/pagefind.js").length > 0);
	assert.ok(
		readdirSync(join(fixture, "dist/pagefind")).some((file) =>
			file.endsWith(".pf_meta"),
		),
	);
	console.log(
		`Consumer build and generated artifacts verified with Astro ${astro}.`,
	);
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
