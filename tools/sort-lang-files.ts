import { readFile, readdir, writeFile } from "node:fs/promises";

const dir = await readdir("./static/lang");
const files = dir.filter((file) => file.endsWith(".json"));

await Promise.all(
	files.map(async (file) => {
		const contents = await readFile(`./static/lang/${file}`, "utf8");
		const json = JSON.parse(contents);
		const entries = Object.entries(json);
		const sorted = entries.sort((a, b) => a[0].localeCompare(b[0]));
		const obj = Object.fromEntries(sorted);
		await writeFile(`./static/lang/${file}`, JSON.stringify(obj, null, "\t"));
	}),
);
