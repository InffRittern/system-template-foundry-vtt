// Use Bun when Bun supports node:fs/promises fully
import { writeFile } from "node:fs/promises";
import { $ } from "bun";

// Version package
await $`bunx changeset version`;

// Import versioned package.json
const {
	default: { version },
} = await import("../package.json", {
	with: { type: "json" },
});

// Import system.json
const { default: manifest } = await import("../system.json", {
	with: { type: "json" },
});

// Update and Write system.json
manifest.version = version;
manifest.download = manifest.download.replace(/v\d+\.\d+\.\d+/, `v${version}`);
await writeFile("system.json", `${JSON.stringify(manifest, null, "\t")}\n`);

// Format system.json
await $`bunx biome format --write .`;
await $`git add -A`;
await $`git commit -m "chore: Version Packages"`;
