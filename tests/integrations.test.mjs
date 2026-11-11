import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { onRequest } from "../packages/astro-early-hints/dist/middleware/index.js";
import robotsTxt from "../packages/astro-robots-txt/dist/index.js";
import securityTxt from "../packages/astro-security-txt/dist/index.js";

async function generate(t, integration) {
	const directory = await mkdtemp(join(tmpdir(), "astro-components-test-"));
	t.after(() => rm(directory, { recursive: true, force: true }));
	const errors = [];
	const logger = {
		info() {},
		warn() {},
		error(message) {
			errors.push(message);
		},
	};
	await integration.hooks["astro:config:done"]({
		config: { site: "https://example.com" },
		logger,
	});
	await integration.hooks["astro:build:done"]({
		dir: pathToFileURL(`${directory}/`),
		logger,
	});
	return { directory, errors };
}

test("robots.txt applies defaults", async (t) => {
	const { directory, errors } = await generate(t, robotsTxt());
	assert.deepEqual(errors, []);
	const text = await readFile(join(directory, "robots.txt"), "utf8");
	assert.match(text, /sitemap: https:\/\/example.com\/sitemap-index.xml/);
	assert.match(text, /user-agent: \*\nallow: \//);
});

test("robots.txt handles agent arrays, zero delay and async transforms", async (t) => {
	const { directory, errors } = await generate(
		t,
		robotsTxt({
			sitemap: false,
			policy: [
				{ userAgent: ["BotA", "BotB"], disallow: "/private", crawlDelay: 0 },
			],
			transform: async (text) => `${text}# transformed\n`,
		}),
	);
	assert.deepEqual(errors, []);
	const text = await readFile(join(directory, "robots.txt"), "utf8");
	assert.match(
		text,
		/user-agent: BotA\nuser-agent: BotB\ndisallow: \/private\ncrawl-delay: 0/,
	);
	assert.match(text, /# transformed\n$/);
	assert.doesNotMatch(text, /sitemap:/);
});

test("invalid options skip generation and log the error", async (t) => {
	const { directory, errors } = await generate(t, robotsTxt({ policy: [] }));
	assert.equal(errors.length, 1);
	await assert.rejects(readFile(join(directory, "robots.txt")), {
		code: "ENOENT",
	});
});

test("security.txt supports defaults and canonical opt-out", async (t) => {
	for (const canonical of [undefined, false]) {
		const { directory, errors } = await generate(
			t,
			securityTxt({
				contact: [
					"mailto:security@example.com",
					"https://example.com/security",
				],
				canonical,
			}),
		);
		assert.deepEqual(errors, []);
		const text = await readFile(
			join(directory, ".well-known/security.txt"),
			"utf8",
		);
		assert.match(
			text,
			/Contact: mailto:security@example.com\nContact: https:\/\/example.com\/security/,
		);
		assert.ok(new Date(text.match(/Expires: (.+)/)[1]) > new Date());
		assert.equal(text.includes("Canonical:"), canonical !== false);
	}
});

test("early hints passes non-HTML responses through", async () => {
	const response = new Response("OK", {
		headers: { "content-type": "text/plain" },
	});
	assert.equal(await onRequest({}, async () => response), response);
});

test("early hints tolerates HTML fragments", async () => {
	const response = await onRequest(
		{},
		async () =>
			new Response("<p>Fragment</p>", {
				headers: { "content-type": "text/html" },
			}),
	);
	assert.equal(await response.text(), "<p>Fragment</p>");
});

test("early hints passes responses without a body through", async () => {
	const response = new Response(null, {
		status: 204,
		headers: { "content-type": "text/html" },
	});
	assert.equal(await onRequest({}, async () => response), response);
});

test("early hints preserves response metadata and escapes asset URLs", async () => {
	const response = await onRequest(
		{},
		async () =>
			new Response(
				`<html><head><link rel="stylesheet" href='/style.css?x="quoted"'><script type="module" src="/app.js"></script></head><body>OK</body></html>`,
				{
					status: 201,
					headers: {
						"content-type": "text/html",
						"content-length": "1",
						"x-custom": "preserved",
					},
				},
			),
	);
	const text = await response.text();
	assert.equal(response.status, 201);
	assert.equal(response.headers.get("x-custom"), "preserved");
	assert.equal(response.headers.get("content-length"), null);
	assert.match(
		text,
		/rel="preload" as="style" href="\/style.css\?x=&quot;quoted&quot;"/,
	);
	assert.match(text, /rel="modulepreload" href="\/app.js"/);
});
