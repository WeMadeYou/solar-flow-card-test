// Builds solar-flow-card.js: translations/*.json become the TRANSLATIONS
// constant, followed by src/*.js in name order, all wrapped in one scope so
// nothing leaks into the page.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const languages = readdirSync(join(root, "translations")).filter((f) => f.endsWith(".json")).sort();
const translations = {};
// English first: it is the fallback for every other language.
for (const file of ["en.json", ...languages.filter((f) => f !== "en.json")]) {
  translations[basename(file, ".json").toLowerCase()] = JSON.parse(readFileSync(join(root, "translations", file), "utf8"));
}

const files = readdirSync(join(root, "src")).filter((f) => f.endsWith(".js")).sort();
const sources = files.map((f) => readFileSync(join(root, "src", f), "utf8").trimEnd());
// Keep the license comment of the first file outside the wrapper.
const banner = sources[0].match(/^\/\*![\s\S]*?\*\//)?.[0] || "";
sources[0] = sources[0].slice(banner.length).trimStart();
sources.splice(1, 0, `// Generated from translations/*.json.\nconst TRANSLATIONS = ${JSON.stringify(translations, null, 2)};`);
writeFileSync(join(root, "solar-flow-card.js"), `${banner}\n(() => {\n${sources.join("\n\n")}\n})();\n`);
console.log(`solar-flow-card.js built from ${files.length} source files and ${Object.keys(translations).length} languages`);
