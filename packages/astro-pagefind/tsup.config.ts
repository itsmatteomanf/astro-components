import { defineConfig } from "tsup";
import { peerDependencies } from "./package.json";

export default defineConfig((options) => {
	const dev = !!options.watch;
	return {
		entry: ["src/**/index.(ts|js)"],
		format: ["esm"],
		target: "node20",
		bundle: true,
		dts: true,
		sourcemap: true,
		clean: true,
		splitting: false,
		minify: !dev,
		external: [...Object.keys(peerDependencies)],
		tsconfig: "tsconfig.json",
	};
});
