import { posix, sep } from "node:path";
import { globby } from "globby";

export default (async () => {
	const paths = await globby("**/*.hbs", { cwd: "./templates" });
	return paths.map((templatePath) => {
		templatePath = templatePath.split(sep).join(posix.sep);
		return `systems/forbidden-lands/templates/${templatePath}`;
	});
})();
