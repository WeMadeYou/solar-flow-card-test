// Compares every translations/*.json with en.json.
// Errors (exit code 1): invalid JSON, a key en.json does not have, a value
// of another type, placeholders like {time} that differ from English.
// Warnings: keys still missing (the card falls back to English for them).
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "translations");
const load = (file) => JSON.parse(readFileSync(join(dir, file), "utf8"));
const placeholders = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

const english = load("en.json");
let errors = 0;
let warnings = 0;

function compare(reference, value, path, report) {
  for (const key of Object.keys(value)) {
    if (!(key in reference)) report("error", `${path}${key}: not in en.json (typo or removed key?)`);
  }
  for (const [key, ref] of Object.entries(reference)) {
    if (!(key in value)) {
      report("warning", `${path}${key}: missing, English is used`);
      continue;
    }
    const own = value[key];
    if (typeof ref === "object") {
      if (typeof own !== "object" || own === null) report("error", `${path}${key}: should be an object like in en.json`);
      else compare(ref, own, `${path}${key}.`, report);
    } else if (typeof own !== "string") {
      report("error", `${path}${key}: should be text`);
    } else if (placeholders(own) !== placeholders(ref)) {
      report("error", `${path}${key}: placeholders {${placeholders(own)}} should be {${placeholders(ref)}}`);
    } else if (!own.trim()) {
      report("warning", `${path}${key}: empty`);
    }
  }
}

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const lines = [];
  const report = (level, message) => {
    lines.push(`  ${level === "error" ? "✗" : "!"} ${message}`);
    if (level === "error") errors += 1;
    else warnings += 1;
  };
  let data;
  try {
    data = load(file);
  } catch (error) {
    report("error", `invalid JSON: ${error.message}`);
  }
  if (data) {
    if (!/^[a-z]{2,3}(-[a-z0-9]{2,8})?\.json$/.test(file)) report("error", "file name should be a lower-case language code, e.g. de.json or pt-br.json");
    if (file !== "en.json") compare(english, data, "", report);
    for (const key of ["languageName", "locale"]) if (!data[key]) report("error", `${key} is required`);
  }
  console.log(`${file}${lines.length ? "" : "  ✓"}`);
  for (const line of lines) console.log(line);
}
console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exitCode = errors ? 1 : 0;
