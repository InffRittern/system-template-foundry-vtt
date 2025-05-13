import { exists, rm } from "node:fs/promises";
import { context } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { args } from "./tools/args-parser.js";
import templatePathsPromise from "./tools/get-template-path.js";

const templatePath = await templatePathsPromise;
const development = Object.hasOwn(args, "development");

console.log(
	`Building test sample for ${development ? "development" : "production"}`,
);

const outputFiles = ["./sample.js", "./sample.css"];

await Promise.all(
	outputFiles.map(async (outputFile) => {
		if (await exists(outputFile)) {
			await rm(outputFile);
		}
	}),
);

const ctx = await context({
	bundle: true,
	entryPoints: ["./src/index.ts", "./src/index.scss"],
	outdir: "./",
	format: "iife",
	logLevel: "info",
	sourcemap: development ? "inline" : false,
	ignoreAnnotations: development,
	minifyWhitespace: true,
	minifySyntax: true,
	drop: development ? [] : ["console", "debugger"],
	define: {
		GLOBALPATHS: JSON.stringify(templatePath),
	},
	plugins: [
		sassPlugin({
			logger: {
				warn: () => "",
			},
		}),
		{
			name: "external-files",
			setup(inBuild) {
				inBuild.onResolve(
					{ filter: /(\.\/assets|\.\/fonts|\/systems)/ },
					() => {
						return { external: true };
					},
				);
			},
		},
	],
});

await ctx.rebuild();

development ? await ctx.watch() : await ctx.dispose();
