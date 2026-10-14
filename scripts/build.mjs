// Concatenates src/*.js (in name order) into solar-flow-card.js, wrapped in
// one scope so nothing leaks into the page.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = readdirSync(join(root, "src")).filter((f) => f.endsWith(".js")).sort();
const sources = files.map((f) => readFileSync(join(root, "src", f), "utf8").trimEnd());
// Keep the license comment of the first file outside the wrapper.
const banner = sources[0].match(/^\/\*![\s\S]*?\*\//)?.[0] || "";
sources[0] = sources[0].slice(banner.length).trimStart();
writeFileSync(join(root, "solar-flow-card.js"), `${banner}\n(() => {\n${sources.join("\n\n")}\n})();\n`);
console.log(`solar-flow-card.js built from ${files.length} files`);
